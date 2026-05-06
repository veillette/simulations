#!/usr/bin/env node
/**
 * Removes straightforward unused top-level `var Name = ...;` lines reported by ESLint
 * (no-unused-vars: assigned/defined never used). Runs eslint -f json per simulation.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllSimDirs } from './sim-manager.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

const msgRe =
    /^'([^']+)' is (?:assigned a value|defined) but never used\.?$/;

/** Single var declaration: var X = anything; */
const singleVarRe = /^(\s*)var\s+([$A-Za-z_][$\w]*)\s*=\s*.+;\s*$/;

function eslintJson(cwd) {
    const r = spawnSync(
        'npx',
        [
            'eslint',
            'src/**/*.js',
            '--ignore-pattern',
            'src/js/lib/**/*.js',
            '--ignore-pattern',
            'src/optimized.js',
            '-f',
            'json',
        ],
        { cwd, encoding: 'utf8', shell: false },
    );
    if (r.error) {
        console.error(cwd, r.error);
        return null;
    }
    try {
        return JSON.parse(r.stdout || '[]');
    } catch {
        return null;
    }
}

function processSim(simDir) {
    const name = simDir.split('/').pop();
    const data = eslintJson(simDir);
    if (!data || !Array.isArray(data)) {
        console.warn('skip (no eslint json):', name);
        return { sim: name, removed: 0, skipped: 0 };
    }

    /** relPath -> Set(lineNumber) */
    const pending = new Map();

    for (const file of data) {
        for (const m of file.messages || []) {
            if (m.ruleId !== 'no-unused-vars' || m.fatal) continue;
            const mm = msgRe.exec(m.message);
            if (!mm) continue;
            const varName = mm[1];
            const path = file.filePath;
            const line = m.line;
            if (!path || !line) continue;
            if (!pending.has(path)) pending.set(path, []);
            pending.get(path).push({ line, varName });
        }
    }

    let removed = 0;
    let skipped = 0;

    for (const [absPath, entries] of pending) {
        const lines = readFileSync(absPath, 'utf8').split(/\r?\n/);
        const toDelete = new Set();

        for (const { line, varName } of entries) {
            const idx = line - 1;
            if (idx < 0 || idx >= lines.length) {
                skipped++;
                continue;
            }
            const text = lines[idx];
            const sm = singleVarRe.exec(text);
            if (sm && sm[2] === varName) {
                toDelete.add(idx);
            } else {
                skipped++;
            }
        }

        if (toDelete.size === 0) continue;

        const next = lines.filter((_, i) => !toDelete.has(i));
        writeFileSync(absPath, next.join('\n').replace(/\n?$/, '\n'));
        removed += toDelete.size;
    }

    if (removed) console.log(`${name}: removed ${removed} line(s), skipped ${skipped}`);
    return { sim: name, removed, skipped };
}

const sims = getAllSimDirs();
let total = 0;
for (const d of sims) {
    const r = processSim(d);
    total += r.removed;
}
console.log(`>> Done. Total lines removed: ${total}`);
