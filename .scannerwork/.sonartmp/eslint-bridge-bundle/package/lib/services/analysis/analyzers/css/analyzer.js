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
exports.analyzeCSS = void 0;
const helpers_1 = require("helpers");
const stylelint_1 = require("linting/stylelint");
/**
 * Analyzes a CSS analysis input
 *
 * Analyzing a CSS analysis input is rather straighforward. All that is needed
 * is to create a Stylelint configuration based on the rules from the active
 * quality profile and uses this configuration to linter the input file.
 *
 * @param input the CSS analysis input to analyze
 * @returns a promise of the CSS analysis output
 */
function analyzeCSS(input) {
    const { filePath, fileContent, rules } = input;
    const code = typeof fileContent == 'string' ? fileContent : (0, helpers_1.readFile)(filePath);
    const config = (0, stylelint_1.createStylelintConfig)(rules);
    const options = {
        code,
        codeFilename: filePath,
        config,
    };
    return stylelint_1.linter.lint(filePath, options);
}
exports.analyzeCSS = analyzeCSS;
//# sourceMappingURL=analyzer.js.map