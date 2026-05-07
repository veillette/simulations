import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, 'src');
const commonDir = path.resolve(__dirname, '../common');
const jsDir = path.resolve(root, 'js');

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
            if (!id || id.startsWith('.') || id.startsWith('/') || id.startsWith('\0') ||
                id.startsWith('node:') || NODE_BUILTINS.has(id)) return null;
            try { return simRequire.resolve(id); } catch { return null; }
        },
    };
}

export default defineConfig({
    root,
    plugins: [resolveFromSimRoot()],
    resolve: {
        alias: [
            { find: 'views',     replacement: path.resolve(jsDir, 'views') },
            { find: 'models',    replacement: path.resolve(jsDir, 'models') },
            { find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') },
            { find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') },
            { find: 'templates', replacement: path.resolve(root, 'templates') },
            { find: 'styles',    replacement: path.resolve(root, 'styles') },
            { find: /^filters$/, replacement: path.resolve(__dirname, 'node_modules/filters/index.js') },
            { find: 'common',           replacement: commonDir },
            { find: /^object-pool$/,    replacement: path.resolve(commonDir, 'pool.js') },
            { find: /^vector2-node$/,   replacement: path.resolve(commonDir, 'math/vector2.js') },
            { find: /^pixi$/, replacement: 'pixi.js' },
            { find: /^nouislider$/, replacement: path.resolve(__dirname, 'node_modules/nouislider/distribute/jquery.nouislider.js') },
        ],
    },
    css: {
        lightningcss: { errorRecovery: true },
        preprocessorOptions: {
            less: {
                paths: [
                    path.resolve(commonDir, 'styles'),
                ],
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
    },
});
