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
// https://sonarsource.github.io/rspec/#/rspec/S6426/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            issue: 'Remove ".only()" from your test case.',
            quickfix: 'Remove ."only()".',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                if ((0, helpers_1.isMethodCall)(node)) {
                    const { property, object } = node.callee;
                    if ((0, helpers_1.isIdentifier)(property, 'only') && (0, helpers_1.isIdentifier)(object, 'describe', 'it', 'test')) {
                        context.report({
                            messageId: 'issue',
                            node: property,
                            suggest: [
                                {
                                    fix: (fixer) => {
                                        const fixes = [fixer.remove(property)];
                                        const dotBeforeOnly = context.getSourceCode().getTokenBefore(property);
                                        if (dotBeforeOnly != null) {
                                            fixes.push(fixer.remove(dotBeforeOnly));
                                        }
                                        return fixes;
                                    },
                                    messageId: 'quickfix',
                                },
                            ],
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-exclusive-tests.js.map