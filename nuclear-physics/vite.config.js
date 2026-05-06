import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, 'src');
const commonDir = path.resolve(__dirname, '../common');
const jsDir = path.resolve(root, 'js');

export default defineConfig({
    root,
    resolve: {
        alias: [
            // Sim-local directories
            { find: 'views',     replacement: path.resolve(jsDir, 'views') },
            { find: 'models',    replacement: path.resolve(jsDir, 'models') },
            // Sim-local single-file aliases (exact match via regex)
            { find: /^assets$/,    replacement: path.resolve(jsDir, 'assets.js') },
            { find: /^constants$/, replacement: path.resolve(jsDir, 'constants.js') },
            // Template & style directories
            { find: 'templates', replacement: path.resolve(root, 'templates') },
            { find: 'styles',    replacement: path.resolve(root, 'styles') },
            // Shared common library
            { find: 'common',    replacement: commonDir },
            // Single-file aliases used inside common/
            { find: /^object-pool$/,   replacement: path.resolve(commonDir, 'pool.js') },
            { find: /^vector2-node$/,  replacement: path.resolve(commonDir, 'math/vector2.js') },
            // AMD used 'pixi' as the module id; ESM needs 'pixi.js'
            { find: /^pixi$/,          replacement: 'pixi.js' },
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                // Allow Less to find files relative to common/styles for cross-imports
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
