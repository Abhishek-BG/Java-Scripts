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
// https://sonarsource.github.io/rspec/#/rspec/S2990/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            removeThis: `Remove the use of "this".`,
            suggestRemoveThis: 'Remove "this"',
            suggestUseWindow: 'Replace "this" with "window" object',
        },
    },
    create(context) {
        return {
            'MemberExpression[object.type="ThisExpression"]'(node) {
                const memberExpression = node;
                const scopeType = context.getScope().variableScope.type;
                const isInsideClass = context
                    .getAncestors()
                    .some(ancestor => ancestor.type === 'ClassDeclaration' || ancestor.type === 'ClassExpression');
                if ((scopeType === 'global' || scopeType === 'module') && !isInsideClass) {
                    const suggest = [];
                    if (!memberExpression.computed) {
                        const propertyText = context.getSourceCode().getText(memberExpression.property);
                        suggest.push({
                            messageId: 'suggestRemoveThis',
                            fix: fixer => fixer.replaceText(node, propertyText),
                        }, {
                            messageId: 'suggestUseWindow',
                            fix: fixer => fixer.replaceText(memberExpression.object, 'window'),
                        });
                    }
                    context.report({
                        messageId: 'removeThis',
                        node: memberExpression.object,
                        suggest,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-global-this.js.map