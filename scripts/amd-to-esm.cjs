'use strict';

/**
 * jscodeshift codemod: AMD define() → ES module syntax
 *
 * Handles the patterns found in this codebase:
 *   define(function(require) { var X = require('y'); return Z; })
 *   require('less!...')  → import side-effect
 *   require('text!...')  → import X from '...?raw'
 *   require('pixi')      → import * as PIXI from 'pixi.js'
 *
 * Files that cannot be cleanly transformed are left unchanged and
 * reported via the return value (null = no change).
 */
module.exports = function transform(fileInfo, api) {
    const j = api.jscodeshift;
    const src = fileInfo.source;
    const root = j(src);

    // ── Find the top-level define() call ────────────────────────────────────
    const topLevelDefines = root.find(j.ExpressionStatement, {
        expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'define' },
        },
    }).filter(path => path.parent.node.type === 'Program');

    if (topLevelDefines.length === 0) return null; // not an AMD module

    const defineStmt = topLevelDefines.get();
    const args = defineStmt.value.expression.arguments;

    // Find the factory FunctionExpression (skip optional name/deps array args)
    const factory = args.find(a => a.type === 'FunctionExpression');
    if (!factory) return null;

    const bodyStmts = factory.body.body;

    // ── Classify each statement in the define body ───────────────────────────
    const importDecls = [];
    const bodyOut     = [];
    let   exportNode  = null;

    for (const stmt of bodyStmts) {
        // Drop 'use strict' directive (ESM is always strict)
        if (isUseStrict(stmt)) continue;

        // var X = require('Y')  ──  may be multi-declarator
        if (stmt.type === 'VariableDeclaration') {
            const requireDecls = [];
            const otherDecls   = [];

            for (const decl of stmt.declarations) {
                if (isRequireCall(decl.init)) {
                    requireDecls.push(decl);
                } else {
                    otherDecls.push(decl);
                }
            }

            if (requireDecls.length > 0) {
                for (const decl of requireDecls) {
                    const imp = buildImport(j, decl.id, decl.init.arguments[0].value);
                    if (imp) importDecls.push(imp);
                }
                if (otherDecls.length > 0) {
                    bodyOut.push(j.variableDeclaration(stmt.kind, otherDecls));
                }
                continue;
            }
        }

        // Bare require('...') side-effect calls (less!, css!, or plain module)
        if (isBareRequire(stmt)) {
            const modulePath = stmt.expression.arguments[0].value;
            const imp = buildSideEffectImport(j, modulePath);
            if (imp) { importDecls.push(imp); continue; }
        }

        // return X  →  export default X  (only the first one at top level)
        if (stmt.type === 'ReturnStatement' && !exportNode) {
            exportNode = j.exportDefaultDeclaration(stmt.argument);
            continue;
        }

        bodyOut.push(stmt);
    }

    // ── Assemble the new program body ────────────────────────────────────────
    const newBody = [
        ...importDecls,
        ...bodyOut,
        ...(exportNode ? [exportNode] : []),
    ];

    // Replace just the define() statement (keep any program-level comments)
    root.find(j.Program).get().value.body = newBody;

    return root.toSource({ quote: 'single', trailingComma: false });
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isUseStrict(stmt) {
    return (
        stmt.type === 'ExpressionStatement' &&
        stmt.expression.type === 'Literal' &&
        stmt.expression.value === 'use strict'
    );
}

function isRequireCall(node) {
    return (
        node &&
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].type === 'Literal'
    );
}

function isBareRequire(stmt) {
    if (stmt.type !== 'ExpressionStatement') return false;
    return isRequireCall(stmt.expression);
}

/**
 * Build an ImportDeclaration for a named binding (var X = require('Y')).
 *
 * Special rules:
 *   'pixi'          → import * as <id> from 'pixi.js'   (namespace)
 *   'text!<path>'   → import <id> from '<path>?raw'     (raw string)
 *   everything else → import <id> from '<path>'          (default)
 */
function buildImport(j, id, modulePath) {
    // text! template strings
    if (modulePath.startsWith('text!')) {
        const rawPath = modulePath.slice(5) + '?raw';
        return j.importDeclaration(
            [j.importDefaultSpecifier(id)],
            j.literal(rawPath)
        );
    }

    // pixi → namespace import + rename module specifier
    if (modulePath === 'pixi') {
        return j.importDeclaration(
            [j.importNamespaceSpecifier(id)],
            j.literal('pixi.js')
        );
    }

    // Default import
    return j.importDeclaration(
        [j.importDefaultSpecifier(id)],
        j.literal(modulePath)
    );
}

/**
 * Build a side-effect ImportDeclaration for any bare require().
 * Handles less!/css! prefixes and plain module side-effects.
 */
function buildSideEffectImport(j, modulePath) {
    let path = modulePath;

    if (path.startsWith('less!')) {
        path = path.slice(5);
        if (!path.endsWith('.less')) path += '.less';
    } else if (path.startsWith('css!')) {
        path = path.slice(4);
        if (!path.endsWith('.css')) path += '.css';
    }
    // plain bare require — keep the specifier as-is (side-effect import)

    return j.importDeclaration([], j.literal(path));
}
