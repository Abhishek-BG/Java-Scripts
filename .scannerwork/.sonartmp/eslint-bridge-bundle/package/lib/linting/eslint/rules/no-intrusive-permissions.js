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
// https://sonarsource.github.io/rspec/#/rspec/S5604/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const permissions = ['geolocation', 'camera', 'microphone', 'notifications', 'persistent-storage'];
exports.rule = {
    meta: {
        messages: {
            checkPermission: 'Make sure the use of the {{feature}} is necessary.',
        },
    },
    create(context) {
        return {
            'CallExpression[callee.type="MemberExpression"]'(node) {
                const call = node;
                const callee = call.callee;
                if (isNavigatorMemberExpression(callee, 'permissions', 'query') &&
                    call.arguments.length > 0) {
                    checkPermissions(context, call);
                    return;
                }
                if (context.options.includes('geolocation') &&
                    isNavigatorMemberExpression(callee, 'geolocation', 'watchPosition', 'getCurrentPosition')) {
                    context.report({
                        messageId: 'checkPermission',
                        data: {
                            feature: 'geolocation',
                        },
                        node: callee,
                    });
                    return;
                }
                if (isNavigatorMemberExpression(callee, 'mediaDevices', 'getUserMedia') &&
                    call.arguments.length > 0) {
                    const firstArg = (0, helpers_1.getValueOfExpression)(context, call.arguments[0], 'ObjectExpression');
                    checkForCameraAndMicrophonePermissions(context, callee, firstArg);
                    return;
                }
                if (context.options.includes('notifications') &&
                    (0, helpers_1.isMemberExpression)(callee, 'Notification', 'requestPermission')) {
                    context.report({
                        messageId: 'checkPermission',
                        data: {
                            feature: 'notifications',
                        },
                        node: callee,
                    });
                    return;
                }
                if (context.options.includes('persistent-storage') &&
                    (0, helpers_1.isMemberExpression)(callee.object, 'navigator', 'storage')) {
                    context.report({
                        messageId: 'checkPermission',
                        data: {
                            feature: 'persistent-storage',
                        },
                        node: callee,
                    });
                }
            },
            NewExpression(node) {
                const { callee } = node;
                if (context.options.includes('notifications') && (0, helpers_1.isIdentifier)(callee, 'Notification')) {
                    context.report({
                        messageId: 'checkPermission',
                        data: {
                            feature: 'notifications',
                        },
                        node: callee,
                    });
                }
            },
        };
    },
};
function checkForCameraAndMicrophonePermissions(context, callee, firstArg) {
    if (!firstArg) {
        return;
    }
    const shouldCheckAudio = context.options.includes('microphone');
    const shouldCheckVideo = context.options.includes('camera');
    if (!shouldCheckAudio && !shouldCheckVideo) {
        return;
    }
    const perms = [];
    for (const prop of firstArg.properties) {
        if (prop.type === 'Property') {
            const { value, key } = prop;
            if ((0, helpers_1.isIdentifier)(key, 'audio') && shouldCheckAudio && isOtherThanFalse(context, value)) {
                perms.push('microphone');
            }
            else if ((0, helpers_1.isIdentifier)(key, 'video') &&
                shouldCheckVideo &&
                isOtherThanFalse(context, value)) {
                perms.push('camera');
            }
        }
    }
    if (perms.length > 0) {
        context.report({
            messageId: 'checkPermission',
            data: {
                feature: perms.join(' and '),
            },
            node: callee,
        });
    }
}
function isOtherThanFalse(context, value) {
    const exprValue = (0, helpers_1.getValueOfExpression)(context, value, 'Literal');
    if (exprValue && exprValue.value === false) {
        return false;
    }
    return true;
}
function checkPermissions(context, call) {
    const firstArg = (0, helpers_1.getValueOfExpression)(context, call.arguments[0], 'ObjectExpression');
    if ((firstArg === null || firstArg === void 0 ? void 0 : firstArg.type) === 'ObjectExpression') {
        const nameProp = firstArg.properties.find(prop => hasNamePropertyWithPermission(prop, context));
        if (nameProp) {
            const { value } = nameProp.value;
            context.report({
                messageId: 'checkPermission',
                data: {
                    feature: String(value),
                },
                node: nameProp,
            });
        }
    }
}
function isNavigatorMemberExpression({ object, property }, firstProperty, ...secondProperty) {
    return ((0, helpers_1.isMemberExpression)(object, 'navigator', firstProperty) &&
        (0, helpers_1.isIdentifier)(property, ...secondProperty));
}
function hasNamePropertyWithPermission(prop, context) {
    if (prop.type === 'Property' && (0, helpers_1.isIdentifier)(prop.key, 'name')) {
        const value = (0, helpers_1.getValueOfExpression)(context, prop.value, 'Literal');
        return (value &&
            typeof value.value === 'string' &&
            permissions.includes(value.value) &&
            context.options.includes(value.value));
    }
    return false;
}
//# sourceMappingURL=no-intrusive-permissions.js.map