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
// https://sonarsource.github.io/rspec/#/rspec/S5148/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const REQUIRED_OPTION = 'noopener';
const REQUIRED_OPTION_INDEX = 2;
const URL_INDEX = 0;
exports.rule = {
    meta: {
        messages: {
            missingNoopener: 'Make sure not using "noopener" is safe here.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                if (!(0, helpers_1.isMethodCall)(node)) {
                    return;
                }
                const { object, property } = node.callee;
                const isWindowOpen = (0, helpers_1.isIdentifier)(property, 'open') &&
                    ((0, helpers_1.isIdentifier)(object, 'window') || isThisWindow(object));
                if (!isWindowOpen) {
                    return;
                }
                const args = node.arguments;
                const hasHttpUrl = URL_INDEX < args.length && isHttpUrl(context, args[URL_INDEX]);
                if (!hasHttpUrl) {
                    return;
                }
                if (args.length <= REQUIRED_OPTION_INDEX ||
                    !hasRequiredOption(context, args[REQUIRED_OPTION_INDEX])) {
                    context.report({
                        messageId: 'missingNoopener',
                        node: property,
                    });
                }
            },
        };
    },
};
function isThisWindow(node) {
    return (node.type === 'MemberExpression' &&
        node.object.type === 'ThisExpression' &&
        (0, helpers_1.isIdentifier)(node.property, 'window'));
}
function hasRequiredOption(context, argument) {
    const stringOrNothing = extractString(context, argument);
    return stringOrNothing !== undefined && stringOrNothing.includes(REQUIRED_OPTION);
}
function isHttpUrl(context, argument) {
    const stringOrNothing = extractString(context, argument);
    return (stringOrNothing !== undefined &&
        (stringOrNothing.startsWith('http://') || stringOrNothing.startsWith('https://')));
}
function extractString(context, node) {
    const literalNodeOrNothing = (0, helpers_1.getValueOfExpression)(context, node, 'Literal');
    if (literalNodeOrNothing === undefined || !(0, helpers_1.isStringLiteral)(literalNodeOrNothing)) {
        return undefined;
    }
    else {
        return literalNodeOrNothing.value;
    }
}
//# sourceMappingURL=link-with-target-blank.js.map