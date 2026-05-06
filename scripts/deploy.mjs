#!/usr/bin/env node
/**
 * Builds the dist directory then deploys it to GitHub Pages via the gh-pages package.
 */
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from './sim-manager.mjs';

// Build first
await import('./dist.mjs');

// Deploy using the gh-pages CLI (installed as a devDependency)
execSync('npx gh-pages -d dist --dotfiles', {
    cwd: ROOT,
    stdio: 'inherit',
});

console.log('>> Deployed to GitHub Pages');
