#!/usr/bin/env node
/**
 * Builds every sim that has changed since last build (or all with --all),
 * then assembles the master dist/ directory and processes index.html.
 */
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { runDists, cleanDists, copyDists, processHtmlForDist, ROOT } from './sim-manager.mjs';

const forceAll = process.argv.includes('--all');

await runDists(forceAll);
cleanDists(forceAll);
copyDists(forceAll);
processHtmlForDist(
    join(ROOT, 'index.html'),
    join(ROOT, 'dist', 'index.html')
);

// Create .nojekyll so GitHub Pages serves files that start with underscores
writeFileSync(join(ROOT, 'dist', '.nojekyll'), '');
mkdirSync(join(ROOT, 'dist'), { recursive: true });

console.log('>> dist build complete');
