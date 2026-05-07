#!/usr/bin/env node
/**
 * Comprehensive migration script: AMD → ESM + Vite 8 for all simulations.
 *
 * For each sim this script:
 *   1. Runs the jscodeshift AMD→ESM codemod on src/js/ (excluding config.js / less-shim.js / main.js)
 *   2. Writes a new ESM main.js
 *   3. Writes vite.config.js (with resolveFromSimRoot plugin + all aliases)
 *   4. Patches package.json (adds vite, pixi.js, extra deps; adds dev/build scripts)
 *   5. Rewrites src/index.html to use <script type="module">
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

// ── Vite version to use ──────────────────────────────────────────────────────
const VITE_VERSION = '^8.0.10';
const PIXI_VERSION = '^7.4.2';

// ── Node built-ins (to skip in resolveFromSimRoot) ──────────────────────────
// A minimal set that covers what pixi/node packages use.  The plugin will
// also skip any id starting with 'node:' automatically.
const NODE_BUILTINS = new Set([
  'assert','buffer','child_process','cluster','console','constants','crypto',
  'dgram','dns','domain','events','fs','http','http2','https','module','net',
  'os','path','perf_hooks','process','punycode','querystring','readline',
  'repl','stream','string_decoder','sys','timers','tls','tty','url','util',
  'v8','vm','worker_threads','zlib','_stream_duplex','_stream_passthrough',
  '_stream_readable','_stream_transform','_stream_writable',
]);

// ── Shared vite.config.js plugin block (inlined into every config) ──────────
const RESOLVE_PLUGIN = `
// Resolve bare package imports through this sim's own node_modules so that
// files in common/ and sibling sims (which have no node_modules of their
// own) can find jquery, backbone, pixi.js, etc.
const NODE_BUILTINS = new Set([
  'assert','buffer','child_process','cluster','console','constants','crypto',
  'dgram','dns','domain','events','fs','http','http2','https','module','net',
  'os','path','perf_hooks','process','punycode','querystring','readline',
  'repl','stream','string_decoder','sys','timers','tls','tty','url','util',
  'v8','vm','worker_threads','zlib',
]);
const simRequire = createRequire(path.resolve(__dirname, 'package.json'));
function resolveFromSimRoot() {
    return {
        name: 'resolve-from-sim-root',
        enforce: 'pre',
        resolveId(id) {
            if (!id || id.startsWith('.') || id.startsWith('/') || id.startsWith('\\0') ||
                id.startsWith('node:') || NODE_BUILTINS.has(id)) return null;
            try { return simRequire.resolve(id); } catch { return null; }
        },
    };
}`.trimStart();

// ── Helper: write a file only if content changed ────────────────────────────
function write(filePath, content) {
    const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : null;
    if (existing === content) return;
    writeFileSync(filePath, content, 'utf8');
    console.log(`  wrote ${path.relative(REPO, filePath)}`);
}

// ── Helper: patch package.json ───────────────────────────────────────────────
function patchPackageJson(simDir, extraDeps = {}) {
    const pkgPath = path.join(simDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    // Scripts
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.dev   = 'vite';
    pkg.scripts.build = 'vite build';

    // devDependencies
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies['vite']    = VITE_VERSION;
    pkg.devDependencies['pixi.js'] = PIXI_VERSION;
    for (const [k, v] of Object.entries(extraDeps)) {
        pkg.devDependencies[k] = v;
    }

    // Remove postinstall r.js shim scripts (no longer needed with ESM)
    if (pkg.scripts.postinstall && pkg.scripts.postinstall.includes('r.js')) {
        delete pkg.scripts.postinstall;
    }

    write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

// ── Helper: rewrite index.html ───────────────────────────────────────────────
function rewriteIndexHtml(simDir, title) {
    const htmlPath = path.join(simDir, 'src', 'index.html');
    const html = `<!DOCTYPE html>
<html>
\t<head>
\t\t<title>${title}</title>
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\t\t<script type="module" src="/js/main.js"></script>
\t</head>
\t<body>

\t</body>
</html>
`;
    write(htmlPath, html);
}

// ── Helper: write ESM main.js ────────────────────────────────────────────────
function writeMainJs(simDir, appViewImport) {
    const mainPath = path.join(simDir, 'src', 'js', 'main.js');
    const content = `import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import AppView from '${appViewImport}';

$(function() {
    var appView = new AppView();
    $('body').append(appView.el);
    appView.load();
});
`;
    write(mainPath, content);
}

// ── Helper: run the AMD→ESM codemod ─────────────────────────────────────────
function runCodemod(simDir) {
    const jsDir = path.join(simDir, 'src', 'js');
    if (!existsSync(jsDir)) return;

    // Collect dirs/files to process (exclude config.js, less-shim.js, main.js)
    const targets = [];
    for (const sub of ['views', 'models']) {
        const d = path.join(jsDir, sub);
        if (existsSync(d)) targets.push(d);
    }
    // Also process all loose JS files at the jsDir level, excluding config.js / less-shim.js / main.js
    const SKIP = new Set(['config.js', 'less-shim.js', 'main.js']);
    const rootFiles = readdirSync(jsDir)
        .filter(f => f.endsWith('.js') && !SKIP.has(f))
        .map(f => path.join(jsDir, f));

    if (targets.length === 0 && rootFiles.length === 0) return;

    const allTargets = [...targets, ...rootFiles];
    const args = [
        '--yes',
        'jscodeshift',
        '--transform', path.join(REPO, 'scripts', 'amd-to-esm.cjs'),
        '--extensions=js',
        '--no-babel',
        ...allTargets
    ];
    try {
        const out = execFileSync('npx', args, { cwd: REPO, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
        const m = out.match(/(\d+) ok/);
        if (m) console.log(`  codemod: ${m[1]} files converted`);
    } catch (e) {
        console.error(`  codemod error: ${e.message}`);
    }
}

// ── Helper: build vite.config.js content ────────────────────────────────────
function buildViteConfig({ simDir, extraDirVars = '', aliases, lessPaths = [], extraImports = '' }) {
    const commonDir = path.resolve(REPO, 'common');
    const aliasList = aliases.map(a => `            ${a},`).join('\n');
    const lessPathList = lessPaths.map(p => `                    ${p},`).join('\n');

    return `import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
${extraImports}
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, 'src');
const commonDir = path.resolve(__dirname, '../common');
const jsDir = path.resolve(root, 'js');
${extraDirVars}
${RESOLVE_PLUGIN}

export default defineConfig({
    root,
    plugins: [resolveFromSimRoot()],
    resolve: {
        alias: [
${aliasList}
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                paths: [
${lessPathList}
                ],
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
    },
});
`;
}

// ── Standard aliases shared by all sims ────────────────────────────────────
const COMMON_ALIASES = [
    `{ find: 'common',           replacement: commonDir }`,
    `{ find: /^object-pool$/,    replacement: path.resolve(commonDir, 'pool.js') }`,
    `{ find: /^vector2-node$/,   replacement: path.resolve(commonDir, 'math/vector2.js') }`,
    `{ find: /^pixi$/,           replacement: 'pixi.js' }`,
];

// nouislider v7 has no package.json main field
const NOUISLIDER_ALIAS =
    `{ find: /^nouislider$/, replacement: path.resolve(__dirname, 'node_modules/nouislider/distribute/jquery.nouislider.js') }`;

// ── Standard standalone sim config builder ───────────────────────────────────
function standardAliases(extras = []) {
    return [
        `{ find: 'views',     replacement: path.resolve(jsDir, 'views') }`,
        `{ find: 'models',    replacement: path.resolve(jsDir, 'models') }`,
        `{ find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') }`,
        `{ find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') }`,
        `{ find: 'templates', replacement: path.resolve(root, 'templates') }`,
        `{ find: 'styles',    replacement: path.resolve(root, 'styles') }`,
        ...extras,
        ...COMMON_ALIASES,
    ];
}

// ── Nuclear-physics satellite config builder ────────────────────────────────
function nuclearSatelliteAliases(simName, extraAliases = []) {
    return [
        `{ find: '${simName}/templates', replacement: path.resolve(root, 'templates') }`,
        `{ find: '${simName}/styles',    replacement: path.resolve(root, 'styles') }`,
        `{ find: '${simName}',           replacement: jsDir }`,
        `{ find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') }`,
        `{ find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') }`,
        `{ find: 'nuclear-physics', replacement: nuclearPhysSrcJs }`,
        `{ find: 'views',     replacement: path.resolve(nuclearPhysSrcJs, 'views') }`,
        `{ find: 'models',    replacement: path.resolve(nuclearPhysSrcJs, 'models') }`,
        `{ find: 'templates', replacement: path.resolve(nuclearPhysicsDir, 'src/templates') }`,
        `{ find: 'styles',    replacement: path.resolve(nuclearPhysicsDir, 'src/styles') }`,
        ...extraAliases,
        ...COMMON_ALIASES,
    ];
}

// ── Faraday satellite config builder ────────────────────────────────────────
function faradaySatelliteAliases(simName, assetsSelf = true, extraAliases = []) {
    const selfAssets = assetsSelf
        ? [`{ find: /^assets$/, replacement: path.resolve(jsDir, 'assets.js') }`]
        : [];
    return [
        `{ find: 'local',     replacement: jsDir }`,
        ...selfAssets,
        `{ find: /^faraday-assets$/, replacement: path.resolve(faradayDir, 'src/js/assets.js') }`,
        `{ find: /^constants$/, replacement: path.resolve(faradayDir, 'src/js/constants.js') }`,
        `{ find: 'views',     replacement: path.resolve(faradayDir, 'src/js/views') }`,
        `{ find: 'models',    replacement: path.resolve(faradayDir, 'src/js/models') }`,
        `{ find: 'templates', replacement: path.resolve(faradayDir, 'src/templates') }`,
        `{ find: 'styles',    replacement: path.resolve(faradayDir, 'src/styles') }`,
        ...extraAliases,
        ...COMMON_ALIASES,
    ];
}

// Placeholder — resolved at generation time
let nuclearPhysicsDir, nuclearPhysSrcJs, faradayDir, cckDir, cckSrcJs;

// ── Master sim list ──────────────────────────────────────────────────────────
// Each entry: [simDirName, { title, appViewImport, type, extraDeps, extraAliasBuilder, extraDirVars, lessPaths }]
const SIMS = [
    // ── Already done — only update plugin/vite version ──────────────────────
    // nuclear-physics, moving-man, beta-decay handled separately below

    // ── Standard standalone sims ──────────────────────────────────────────────
    ['arrow-test', {
        title: 'Arrow Test',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['bending-light', {
        title: 'Bending Light',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'sat': '^0.9.0', 'clipper-lib': '^6.4.2' },
        extraAliases: [
            `{ find: /^sat$/, replacement: simRequire.resolve('sat') }`,
            `{ find: /^clipper-lib$/, replacement: simRequire.resolve('clipper-lib') }`,
        ],
    }],
    ['battery-resistor-circuit', {
        title: 'Battery Resistor Circuit',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: {
            'bootstrap-select': '^1.13.18',
            'nouislider': '^7.0.10',
            'buzz': '^2.0.0',
        },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
    ['capacitor-lab', {
        title: 'Capacitor Lab',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['charges-and-fields', {
        title: 'Charges and Fields',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['circuit-construction-kit', {
        title: 'Circuit Construction Kit',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'file-saver': '^2.0.5', 'nouislider': '^7.0.10' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
    ['collision-lab', {
        title: 'Collision Lab',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['discharge-lamps', {
        title: 'Discharge Lamps',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['electric-field-of-dreams', {
        title: 'Electric Field of Dreams',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['energy-forms-and-changes', {
        title: 'Energy Forms and Changes',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['faraday', {
        title: 'Faraday\'s Electromagnetic Lab',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'nouislider': '^7.0.10', 'buzz': '^2.0.0' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
    ['geometric-optics', {
        title: 'Geometric Optics',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['gravity-and-orbits', {
        title: 'Gravity and Orbits',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['greenhouse-effect', {
        title: 'Greenhouse Effect',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['ladybug-motion', {
        title: 'Ladybug Motion',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['lasers', {
        title: 'Lasers',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'gauss-random': '^1.0.1' },
        // gauss-random-shimmed was a postinstall shim; use gauss-random directly
        extraAliases: [
            `{ find: /^gauss-random$/, replacement: path.resolve(__dirname, 'node_modules/gauss-random/index.js') }`,
        ],
    }],
    ['masses-and-springs', {
        title: 'Masses and Springs',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['maze-game', {
        title: 'Maze Game',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['my-solar-system', {
        title: 'My Solar System',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['pendulum-lab', {
        title: 'Pendulum Lab',
        appViewImport: 'views/app',
        type: 'standard',
        // pendulum-lab has constants.js but no assets.js
        noAssets: true,
    }],
    ['photoelectric-effect', {
        title: 'Photoelectric Effect',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'gauss-random': '^1.0.1' },
        extraAliases: [
            `{ find: 'discharge-lamps', replacement: path.resolve(__dirname, '../discharge-lamps/src/js') }`,
            `{ find: 'lasers',          replacement: path.resolve(__dirname, '../lasers/src/js') }`,
            `{ find: /^gauss-random$/, replacement: path.resolve(__dirname, 'node_modules/gauss-random/index.js') }`,
        ],
    }],
    ['projectile-motion', {
        title: 'Projectile Motion',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['radio-waves', {
        title: 'Radio Waves and Electromagnetic Fields',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'filters': '^1.0.6' },
        extraAliases: [
            `{ find: /^filters$/, replacement: path.resolve(__dirname, 'node_modules/filters/index.js') }`,
        ],
    }],
    ['sound', {
        title: 'Sound',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['states-of-matter', {
        title: 'States of Matter',
        appViewImport: 'views/app',
        type: 'standard',
        extraDeps: { 'gauss-random': '^1.0.1' },
        extraAliases: [
            `{ find: /^gauss-random$/, replacement: path.resolve(__dirname, 'node_modules/gauss-random/index.js') }`,
        ],
    }],
    ['vector-addition', {
        title: 'Vector Addition',
        appViewImport: 'views/app',
        type: 'standard',
    }],
    ['wave-interference', {
        title: 'Wave Interference',
        appViewImport: 'views/app',
        type: 'standard',
        // wave-interference has no assets.js and no constants.js
        noAssets: true,
        noConstants: true,
    }],

    // ── Nuclear-physics satellites ─────────────────────────────────────────────
    ['nuclear-fission', {
        title: 'Nuclear Fission',
        appViewImport: 'nuclear-fission/views/app',
        type: 'nuclear-satellite',
        simName: 'nuclear-fission',
    }],
    ['radioactive-dating-game', {
        title: 'Radioactive Dating Game',
        appViewImport: 'radioactive-dating-game/views/app',
        type: 'nuclear-satellite',
        simName: 'radioactive-dating-game',
    }],
    ['rutherford-scattering', {
        title: 'Rutherford Scattering',
        appViewImport: 'rutherford-scattering/views/app',
        type: 'nuclear-satellite',
        simName: 'rutherford-scattering',
        extraAliases: [
            `{ find: /^point-in-polygon$/, replacement: path.resolve(jsDir, 'point-in-polygon.js') }`,
        ],
    }],
    ['hydrogen-atom', {
        title: 'Hydrogen Atom',
        appViewImport: 'hydrogen-atom/views/app',
        type: 'nuclear-satellite',
        simName: 'hydrogen-atom',
        extraAliases: [
            `{ find: 'rutherford-scattering/templates', replacement: path.resolve(__dirname, '../rutherford-scattering/src/templates') }`,
            `{ find: 'rutherford-scattering/styles',    replacement: path.resolve(__dirname, '../rutherford-scattering/src/styles') }`,
            `{ find: 'rutherford-scattering',           replacement: path.resolve(__dirname, '../rutherford-scattering/src/js') }`,
        ],
        extraDirVars: `const rutherfordDir = path.resolve(__dirname, '../rutherford-scattering');`,
    }],

    // ── Faraday satellites ────────────────────────────────────────────────────
    ['generator', {
        title: 'Generator',
        appViewImport: './views/app',
        type: 'faraday-satellite',
        extraDeps: { 'buzz': '^2.0.0', 'nouislider': '^7.0.10' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
    ['magnet-and-compass', {
        title: 'Magnet and Compass',
        appViewImport: './views/app',
        type: 'faraday-satellite',
        extraDeps: { 'buzz': '^2.0.0', 'nouislider': '^7.0.10' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
    ['magnets-and-electromagnets', {
        title: 'Magnets and Electromagnets',
        appViewImport: './views/app',
        type: 'faraday-satellite',
        extraDeps: { 'buzz': '^2.0.0', 'nouislider': '^7.0.10' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],

    // ── Circuit-construction-kit satellite ────────────────────────────────────
    ['circuit-construction-kit-dc-only', {
        title: 'Circuit Construction Kit: DC Only',
        appViewImport: './views/app',
        type: 'cck-satellite',
        extraDeps: { 'file-saver': '^2.0.5', 'sat': '^0.9.0', 'nouislider': '^7.0.10' },
        extraAliases: [NOUISLIDER_ALIAS],
    }],
];

// ── Process a single sim ─────────────────────────────────────────────────────
function processSim([simDirName, cfg]) {
    const simDir = path.join(REPO, simDirName);
    if (!existsSync(simDir)) {
        console.warn(`  SKIP: ${simDirName} (directory not found)`);
        return;
    }
    console.log(`\n── ${simDirName} ──`);

    // Set up directory vars for alias builders
    nuclearPhysicsDir  = path.resolve(REPO, 'nuclear-physics');
    nuclearPhysSrcJs   = path.resolve(nuclearPhysicsDir, 'src/js');
    faradayDir         = path.resolve(REPO, 'faraday');
    cckDir             = path.resolve(REPO, 'circuit-construction-kit');
    cckSrcJs           = path.resolve(cckDir, 'src/js');

    // 1. Codemod
    runCodemod(simDir);

    // 2. Write ESM main.js
    writeMainJs(simDir, cfg.appViewImport);

    // 3. Rewrite index.html
    rewriteIndexHtml(simDir, cfg.title);

    // 4. Patch package.json
    patchPackageJson(simDir, cfg.extraDeps || {});

    // 5. Write vite.config.js
    const viteConfig = buildSimViteConfig(simDir, simDirName, cfg);
    write(path.join(simDir, 'vite.config.js'), viteConfig);
}

function buildSimViteConfig(simDir, simDirName, cfg) {
    const type = cfg.type || 'standard';
    const extraAliases = cfg.extraAliases || [];
    const extraDirVars = cfg.extraDirVars ? '\n' + cfg.extraDirVars : '';

    let aliases;
    let extraDirVarsBlock = '';
    let lessPaths = [`path.resolve(commonDir, 'styles')`];

    if (type === 'standard') {
        const stdExtras = [];
        if (!cfg.noAssets && existsSync(path.join(simDir, 'src/js/assets.js'))) {
            stdExtras.push(`{ find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') }`);
        }
        if (!cfg.noConstants && existsSync(path.join(simDir, 'src/js/constants.js'))) {
            stdExtras.push(`{ find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') }`);
        }
        aliases = [
            `{ find: 'views',     replacement: path.resolve(jsDir, 'views') }`,
            `{ find: 'models',    replacement: path.resolve(jsDir, 'models') }`,
            ...stdExtras,
            `{ find: 'templates', replacement: path.resolve(root, 'templates') }`,
            `{ find: 'styles',    replacement: path.resolve(root, 'styles') }`,
            ...extraAliases,
            ...COMMON_ALIASES,
        ];

    } else if (type === 'nuclear-satellite') {
        const simName = cfg.simName || simDirName;
        extraDirVarsBlock = `
const nuclearPhysicsDir  = path.resolve(__dirname, '../nuclear-physics');
const nuclearPhysSrcJs   = path.resolve(nuclearPhysicsDir, 'src/js');`;
        lessPaths = [
            `path.resolve(commonDir, 'styles')`,
            `path.resolve(nuclearPhysicsDir, 'src/styles')`,
        ];
        aliases = [
            `{ find: '${simName}/templates', replacement: path.resolve(root, 'templates') }`,
            `{ find: '${simName}/styles',    replacement: path.resolve(root, 'styles') }`,
            `{ find: '${simName}',           replacement: jsDir }`,
            `{ find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') }`,
            `{ find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') }`,
            `{ find: 'nuclear-physics', replacement: nuclearPhysSrcJs }`,
            `{ find: 'views',     replacement: path.resolve(nuclearPhysSrcJs, 'views') }`,
            `{ find: 'models',    replacement: path.resolve(nuclearPhysSrcJs, 'models') }`,
            `{ find: 'templates', replacement: path.resolve(nuclearPhysicsDir, 'src/templates') }`,
            `{ find: 'styles',    replacement: path.resolve(nuclearPhysicsDir, 'src/styles') }`,
            ...extraAliases,
            ...COMMON_ALIASES,
        ];

    } else if (type === 'faraday-satellite') {
        extraDirVarsBlock = `
const faradayDir = path.resolve(__dirname, '../faraday');`;
        lessPaths = [
            `path.resolve(commonDir, 'styles')`,
            `path.resolve(faradayDir, 'src/styles')`,
        ];
        aliases = [
            `{ find: 'local',     replacement: jsDir }`,
            `{ find: /^assets$/,  replacement: path.resolve(jsDir, 'assets.js') }`,
            `{ find: /^faraday-assets$/, replacement: path.resolve(faradayDir, 'src/js/assets.js') }`,
            `{ find: /^constants$/, replacement: path.resolve(faradayDir, 'src/js/constants.js') }`,
            `{ find: 'views',     replacement: path.resolve(faradayDir, 'src/js/views') }`,
            `{ find: 'models',    replacement: path.resolve(faradayDir, 'src/js/models') }`,
            `{ find: 'templates', replacement: path.resolve(faradayDir, 'src/templates') }`,
            `{ find: 'styles',    replacement: path.resolve(faradayDir, 'src/styles') }`,
            ...extraAliases,
            ...COMMON_ALIASES,
        ];

    } else if (type === 'cck-satellite') {
        extraDirVarsBlock = `
const cckDir    = path.resolve(__dirname, '../circuit-construction-kit');
const cckSrcJs  = path.resolve(cckDir, 'src/js');`;
        lessPaths = [
            `path.resolve(commonDir, 'styles')`,
            `path.resolve(cckDir, 'src/styles')`,
        ];
        aliases = [
            `{ find: 'local',       replacement: jsDir }`,
            `{ find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') }`,
            `{ find: /^circuit-construction-kit-assets$/, replacement: path.resolve(cckSrcJs, 'assets.js') }`,
            `{ find: /^constants$/, replacement: path.resolve(cckSrcJs, 'constants.js') }`,
            `{ find: 'views',       replacement: path.resolve(cckSrcJs, 'views') }`,
            `{ find: 'models',      replacement: path.resolve(cckSrcJs, 'models') }`,
            `{ find: 'persistence', replacement: path.resolve(cckSrcJs, 'persistence') }`,
            `{ find: 'templates',   replacement: path.resolve(cckDir, 'src/templates') }`,
            `{ find: 'styles',      replacement: path.resolve(cckDir, 'src/styles') }`,
            ...extraAliases,
            ...COMMON_ALIASES,
        ];
    }

    return buildViteConfig({
        simDir,
        extraDirVars: extraDirVarsBlock + (cfg.extraDirVars ? '\n' + cfg.extraDirVars : ''),
        aliases,
        lessPaths,
    });
}

// ── Also update the 3 already-processed sims (fix plugin + vite version) ────
function updateAlreadyProcessedSims() {
    for (const simName of ['nuclear-physics', 'moving-man', 'beta-decay']) {
        const simDir = path.join(REPO, simName);
        console.log(`\n── ${simName} (updating vite version + plugin) ──`);
        patchPackageJson(simDir, {});
        // The vite.config.js for these was already written correctly by earlier
        // steps; just make sure the vite version in package.json is updated.
    }
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log('=== Migrating all simulations to ESM + Vite 8 ===\n');
updateAlreadyProcessedSims();
for (const entry of SIMS) {
    processSim(entry);
}
console.log('\n=== Done ===');
console.log('Next: run `npm install && npm run build` in each sim directory.');
