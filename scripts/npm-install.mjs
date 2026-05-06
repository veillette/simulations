#!/usr/bin/env node
import { npmInstall } from './sim-manager.mjs';

const forceAll = process.argv.includes('--all');
await npmInstall(forceAll);
