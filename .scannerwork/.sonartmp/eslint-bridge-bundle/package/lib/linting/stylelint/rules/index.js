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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const function_calc_no_invalid_1 = require("./function-calc-no-invalid");
/**
 * The set of internal Stylelint-based rules
 */
const rules = {};
exports.rules = rules;
/**
 * Maps Stylelint rule keys to rule implementations
 */
rules[function_calc_no_invalid_1.rule.ruleName] = function_calc_no_invalid_1.rule.rule;
//# sourceMappingURL=index.js.map