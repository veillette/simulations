#!/usr/bin/env node
/**
 * Lints simulations from the repository root.
 * Defaults to all sims; pass --changed to lint only updated sims.
 * Pass --fix to apply auto-fixable changes.
 */
import { lintSims } from './sim-manager.mjs';

const args = new Set(process.argv.slice(2));
const forceAll = !args.has('--changed');
const fix = args.has('--fix');

await lintSims({ forceAll, fix });
