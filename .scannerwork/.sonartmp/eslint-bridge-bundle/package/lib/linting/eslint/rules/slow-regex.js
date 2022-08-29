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
// https://sonarsource.github.io/rspec/#/rspec/S5852/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const scslre_1 = require("scslre");
const regex_1 = require("./helpers/regex");
const message = `Make sure the regex used here, which is vulnerable to super-linear runtime due to backtracking, cannot lead to denial of service.`;
exports.rule = (0, regex_1.createRegExpRule)(context => {
    return {
        onRegExpLiteralEnter: (node) => {
            const { reports } = (0, scslre_1.analyse)(node);
            if (reports.length > 0) {
                context.report({
                    message,
                    node: context.node,
                });
            }
        },
    };
});
//# sourceMappingURL=slow-regex.js.map