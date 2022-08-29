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
// https://sonarsource.github.io/rspec/#/rspec/S5443/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const UNIX_DIRECTORIES = [
    '/tmp/',
    '/var/tmp/',
    '/usr/tmp/',
    '/dev/shm/',
    '/dev/mqueue/',
    '/run/lock/',
    '/var/run/lock/',
    '/library/caches/',
    '/users/shared/',
    '/private/tmp/',
    '/private/var/tmp/',
].map(v => new RegExp(`^${v}`, 'i'));
const WINDOWS_DIRECTORIES_PATTERN = new RegExp('^[^\\\\]*(\\\\){1,2}(Windows(\\\\){1,2}Temp|Temp|TMP)(\\\\.*|$)', 'i');
const SENSITIVE_ENV_VARIABLES = ['TMPDIR', 'TMP', 'TEMPDIR', 'TEMP'];
exports.rule = {
    meta: {
        messages: {
            safeDirectory: 'Make sure publicly writable directories are used safely here.',
        },
    },
    create(context) {
        return {
            Literal: (node) => {
                var _a;
                const literal = node;
                // Using literal.raw instead of literal.value as the latter escapes backslashes
                const value = (_a = literal.raw) === null || _a === void 0 ? void 0 : _a.slice(1, literal.raw.length - 1);
                if (value &&
                    (UNIX_DIRECTORIES.find(i => value.match(i)) || value.match(WINDOWS_DIRECTORIES_PATTERN))) {
                    context.report({
                        node: literal,
                        messageId: 'safeDirectory',
                    });
                }
            },
            MemberExpression: (node) => {
                const memberExpression = node;
                const { object, property } = memberExpression;
                if (property.type !== 'Identifier' ||
                    !SENSITIVE_ENV_VARIABLES.includes(property.name) ||
                    object.type !== 'MemberExpression') {
                    return;
                }
                if (object.property.type === 'Identifier' &&
                    object.property.name === 'env' &&
                    object.object.type === 'Identifier' &&
                    object.object.name === 'process') {
                    context.report({ node: memberExpression, messageId: 'safeDirectory' });
                }
            },
        };
    },
};
//# sourceMappingURL=publicly-writable-directories.js.map