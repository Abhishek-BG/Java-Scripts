"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S1172/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            removeOrRenameParameter: 'Remove the unused function parameter "{{param}}" or rename it to "_{{param}}" to make intention explicit.',
            suggestRemoveParameter: 'Remove "{{param}}" (beware of call sites)',
            suggestRenameParameter: 'Rename "{{param}}" to "_{{param}}"',
        },
    },
    create(context) {
        return {
            'FunctionDeclaration, FunctionExpression': function (node) {
                reportUnusedArgument(node, node.id, context);
            },
            ArrowFunctionExpression: (node) => {
                reportUnusedArgument(node, undefined, context);
            },
        };
    },
};
function reportUnusedArgument(node, functionId, context) {
    const parent = node.parent;
    if (parent && parent.type === 'Property' && parent.kind === 'set') {
        return;
    }
    if (context
        .getScope()
        .variables.some(v => v.name === 'arguments' && v.identifiers.length === 0 && v.references.length > 0)) {
        return;
    }
    let parametersVariable = context.getDeclaredVariables(node);
    if (functionId) {
        parametersVariable = parametersVariable.filter(v => v.name !== functionId.name);
    }
    for (const param of parametersVariable) {
        if (isUnusedVariable(param) &&
            !isIgnoredParameter(param) &&
            !isParameterProperty(param) &&
            !isThisParameter(param)) {
            context.report({
                messageId: 'removeOrRenameParameter',
                node: param.identifiers[0],
                data: {
                    param: param.name,
                },
                suggest: getSuggestions(param, context),
            });
        }
    }
}
function getSuggestions(paramVariable, context) {
    const paramIdentifier = paramVariable.identifiers[0];
    const suggestions = [
        {
            messageId: 'suggestRenameParameter',
            data: {
                param: paramVariable.name,
            },
            fix: fixer => fixer.insertTextBefore(paramIdentifier, '_'),
        },
    ];
    const func = paramVariable.defs[0].node;
    if (paramIdentifier.parent === func) {
        suggestions.push(getParameterRemovalSuggestion(func, paramVariable, paramIdentifier, context));
    }
    return suggestions;
}
function getParameterRemovalSuggestion(func, paramVariable, paramIdentifier, context) {
    return {
        messageId: 'suggestRemoveParameter',
        data: {
            param: paramVariable.name,
        },
        fix: fixer => {
            const paramIndex = func.params.indexOf(paramIdentifier);
            const param = func.params[paramIndex];
            if (func.params.length === 1) {
                const openingParenthesis = context.getSourceCode().getTokenBefore(param);
                const closingParenthesis = context
                    .getSourceCode()
                    .getTokenAfter(param, token => token.value === ')');
                let [start, end] = param.range;
                if (openingParenthesis && openingParenthesis.value === '(') {
                    start = openingParenthesis.range[0];
                    end = closingParenthesis.range[1];
                }
                return fixer.replaceTextRange([start, end], '()');
            }
            else if (func.params.length - 1 === paramIndex) {
                const commaAfter = context
                    .getSourceCode()
                    .getTokenAfter(param, token => token.value === ',');
                const commaBefore = context
                    .getSourceCode()
                    .getTokenBefore(param, token => token.value === ',');
                let start = commaBefore.range[1];
                let end = param.range[1];
                if (commaAfter) {
                    end = commaAfter.range[1];
                }
                else {
                    start = commaBefore.range[0];
                }
                return fixer.removeRange([start, end]);
            }
            else {
                const [start] = func.params[paramIndex].range;
                const [end] = func.params[paramIndex + 1].range;
                return fixer.removeRange([start, end]);
            }
        },
    };
}
function isUnusedVariable(variable) {
    const refs = variable.references;
    //Parameter with default value has one reference, but should still be considered as unused.
    return refs.length === 0 || (refs.length === 1 && refs[0].init);
}
function isIgnoredParameter(variable) {
    return variable.name.startsWith('_');
}
function isParameterProperty(variable) {
    return variable.defs.some(def => { var _a; return ((_a = def.name.parent) === null || _a === void 0 ? void 0 : _a.type) === 'TSParameterProperty'; });
}
function isThisParameter(variable) {
    return variable.name === 'this';
}
//# sourceMappingURL=no-unused-function-argument.js.map