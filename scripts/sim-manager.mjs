/**
 * sim-manager.mjs – ESM port of grunt/sim-manager.js
 *
 * Provides utilities for managing the collection of simulation sub-projects:
 * building, copying, cleaning dist folders, and running npm install.
 * No grunt dependency – usable directly from npm scripts or other Node tools.
 */

import { spawnSync, spawn } from 'node:child_process';
import {
    existsSync, mkdirSync, rmSync, cpSync,
    closeSync, openSync, readdirSync,
    readFileSync, writeFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');

// Directories that are not simulation projects
const NON_SIM_DIRS = new Set([
    'common', 'grunt', 'scripts', 'dist', 'node_modules', 'template',
]);

/**
 * Returns absolute paths of every sim directory (has a Gruntfile.js, not excluded).
 */
export function getAllSimDirs() {
    return readdirSync(ROOT, { withFileTypes: true })
        .filter(e =>
            e.isDirectory() &&
            !NON_SIM_DIRS.has(e.name) &&
            !e.name.startsWith('.') &&
            existsSync(join(ROOT, e.name, 'Gruntfile.js'))
        )
        .map(e => join(ROOT, e.name));
}

export function getAllSimDirNames() {
    return getAllSimDirs().map(d => d.split('/').pop());
}

/**
 * Returns sim dirs that have files newer than .build_timestamp.
 * Falls back to all dirs if the timestamp file is absent.
 */
export function getUpdatedSimDirs() {
    const dirs = getAllSimDirs();

    if (!existsSync(join(ROOT, '.build_timestamp'))) {
        return dirs;
    }

    return dirs.filter(dir => {
        const result = spawnSync('find', [
            dir, '-type', 'f',
            '-newer', join(ROOT, '.build_timestamp'),
            '-not', '-iwholename', '*node_modules*',
            '-not', '-iwholename', '*bower_components*',
            '-not', '-iwholename', '*dist*',
            '-print', '-quit',
        ]);
        return result.stdout.toString().trim() !== '';
    });
}

export function getUpdatedSimDirNames() {
    return getUpdatedSimDirs().map(d => d.split('/').pop());
}

/**
 * Runs eslint in each sim directory from the repo root.
 * Defaults to changed sims; pass forceAll=true for all sims.
 */
export async function lintSims({
    forceAll = false,
    fix = false,
} = {}) {
    const simDirs = forceAll ? getAllSimDirs() : getUpdatedSimDirs();

    if (simDirs.length === 0) {
        console.log('>> No changed simulations to lint.');
        return;
    }

    let failed = 0;
    for (const dir of simDirs) {
        const args = [
            'eslint',
            'src/**/*.js',
            '--ignore-pattern', 'src/js/lib/**/*.js',
            '--ignore-pattern', 'src/optimized.js',
        ];
        if (fix) {
            args.push('--fix');
        }

        const proc = spawn('npx', args, {
            cwd: dir,
            stdio: 'inherit',
        });

        // eslint-disable-next-line no-await-in-loop
        const code = await new Promise(resolve => proc.on('close', resolve));
        if (code !== 0) {
            failed++;
        }
    }

    const mode = fix ? 'lint+fix' : 'lint';
    const passed = simDirs.length - failed;
    console.log(`>> ${mode} finished: ${passed}/${simDirs.length} simulation(s) passed`);

    if (failed > 0) {
        throw new Error(`${failed} simulation(s) failed ${mode}`);
    }
}

/**
 * Runs `grunt dist` in each changed (or all) sim directory in parallel.
 */
export async function runDists(forceAll = false) {
    const simDirs = forceAll ? getAllSimDirs() : getUpdatedSimDirs();

    if (simDirs.length === 0) {
        console.log('>> All simulations are already up-to-date.');
        return;
    }

    const allCount = getAllSimDirs().length;
    const numUnchanged = allCount - simDirs.length;

    await Promise.all(simDirs.map(dir =>
        new Promise((resolve, reject) => {
            const proc = spawn('npx', ['grunt', 'dist'], { cwd: dir, stdio: 'inherit' });
            proc.on('close', code =>
                code === 0 ? resolve() : reject(new Error(`grunt dist failed in ${dir}`))
            );
        })
    ));

    const unchangedNote = numUnchanged > 0 ? `; ${numUnchanged} remained unchanged` : '';
    console.log(`>> ${simDirs.length} simulation(s) built${unchangedNote}`);

    closeSync(openSync(join(ROOT, '.build_timestamp'), 'w'));
}

/**
 * Removes stale per-sim folders from the master dist/ directory.
 */
export function cleanDists(forceAll = false) {
    const names = forceAll ? getAllSimDirNames() : getUpdatedSimDirNames();
    const distDir = join(ROOT, 'dist');

    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

    let cleaned = 0;
    for (const name of names) {
        const dir = join(distDir, name);
        if (existsSync(dir)) {
            rmSync(dir, { recursive: true, force: true });
            cleaned++;
        }
    }
    const word = cleaned === 1 ? 'directory' : 'directories';
    console.log(`>> ${cleaned} old simulation dist ${word} removed`);
}

/**
 * Copies each sim's dist/ folder into the master dist/ directory.
 */
export function copyDists(forceAll = false) {
    const names = forceAll ? getAllSimDirNames() : getUpdatedSimDirNames();
    const distDir = join(ROOT, 'dist');

    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

    let copied = 0;
    for (const name of names) {
        const src = join(ROOT, name, 'dist');
        const dst = join(distDir, name);
        if (existsSync(src)) {
            cpSync(src, dst, { recursive: true });
            copied++;
        }
    }
    const word = copied === 1 ? 'directory' : 'directories';
    console.log(`>> ${copied} simulation dist ${word} copied into the master dist`);
}

/**
 * Runs `npm install --legacy-peer-deps` in every sim directory (and common/).
 * The legacy-peer-deps flag keeps older grunt tooling installable.
 */
export async function npmInstall(forceAll = false) {
    console.log('Running `npm install` for each simulation...');

    const commonDir = join(ROOT, 'common');
    const allDirs = [...getAllSimDirs(), ...(existsSync(commonDir) ? [commonDir] : [])];

    const dirs = forceAll
        ? allDirs
        : allDirs.filter(dir => {
            const updated = getUpdatedSimDirNames();
            const name = dir.split('/').pop();
            return name === 'common' || updated.includes(name);
        });

    await Promise.all(dirs.map(dir =>
        new Promise(resolve => {
            const proc = spawn('npm', ['install', '--legacy-peer-deps'], {
                cwd: dir,
                stdio: 'inherit',
            });
            proc.on('close', () => resolve());
        })
    ));

    console.log(`>> ${dirs.length} package file(s) installed`);
}

/**
 * Removes node_modules from every sim directory (and common/).
 */
export function cleanNpm() {
    console.log('Cleaning npm dependencies for each project...');

    const commonDir = join(ROOT, 'common');
    const allDirs = [...getAllSimDirs(), ...(existsSync(commonDir) ? [commonDir] : [])];

    let cleaned = 0;
    for (const dir of allDirs) {
        const nodeModules = join(dir, 'node_modules');
        if (existsSync(nodeModules)) {
            rmSync(nodeModules, { recursive: true, force: true });
            cleaned++;
        }
    }
    const word = cleaned === 1 ? 'directory' : 'directories';
    console.log(`>> ${cleaned} node_modules ${word} cleaned`);
}

/**
 * Processes a targethtml-style HTML file, stripping the dev block and
 * exposing the dist block.  Writes the result to outPath.
 *
 * Marker format (same as grunt-targethtml):
 *   <!--(if target dev)><!--> … <!--<!(endif)-->   ← dev-only block
 *   <!--(if target dist)>    … <!(endif)-->         ← dist-only block
 */
export function processHtmlForDist(srcPath, outPath) {
    let html = readFileSync(srcPath, 'utf8');

    // Remove dev-only blocks (including surrounding markers)
    html = html.replace(/<!--\(if target dev\)><!-->([\s\S]*?)<!--<!\(endif\)-->/g, '');

    // Unwrap dist-only blocks (remove surrounding markers, keep content)
    html = html.replace(/<!--\(if target dist\)>([\s\S]*?)<!\(endif\)-->/g, '$1');

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`>> Processed ${srcPath} → ${outPath}`);
}

/**
 * Scaffolds a new sim from the template directory.
 */
export function createNewSim(dirName, packageName, classPrefix, title) {
    const templateDir = join(ROOT, 'template');
    const distDir = join(templateDir, 'dist');

    if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });

    const newDir = join(ROOT, dirName);
    cpSync(templateDir, newDir, { recursive: true });

    const replacements = [
        ['package.json', [{ from: 'template-sim', to: packageName }]],
        ['README.md', [
            { from: 'template', to: dirName },
            { from: 'Empty Simulation Template', to: title },
        ]],
        ['src/index.html', [{ from: 'Empty Simulation', to: title }]],
        ['src/js/main.js', [{ from: 'TemplateAppView', to: `${classPrefix}AppView` }]],
        ['src/js/views/app.js', [{ from: 'Template', to: classPrefix }]],
        ['src/js/views/sim.js', [
            { from: 'TemplateSimulation', to: `${classPrefix}Simulation` },
            { from: 'TemplateSimView', to: `${classPrefix}SimView` },
            { from: 'TemplateSceneView', to: `${classPrefix}SceneView` },
            { from: 'Template Sim', to: title },
            { from: 'template-sim', to: packageName },
        ]],
        ['src/js/views/scene.js', [{ from: 'Template', to: classPrefix }]],
        ['src/js/models/simulation.js', [{ from: 'Template', to: classPrefix }]],
    ];

    for (const [file, rules] of replacements) {
        const filePath = join(newDir, file);
        if (!existsSync(filePath)) continue;
        let contents = readFileSync(filePath, 'utf8');
        for (const { from, to } of rules) {
            contents = contents.replace(new RegExp(from, 'g'), to);
        }
        writeFileSync(filePath, contents, 'utf8');
    }

    console.log(`>> New sim created in ${newDir}/`);
}
