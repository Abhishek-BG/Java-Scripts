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
exports.analyzeYAML = exports.EMPTY_YAML_ANALYSIS_OUTPUT = void 0;
const eslint_1 = require("linting/eslint");
const yaml_1 = require("parsing/yaml");
const analysis_1 = require("services/analysis");
/**
 * An empty YAML analysis output
 */
exports.EMPTY_YAML_ANALYSIS_OUTPUT = {
    issues: [],
};
/**
 * Analyzes a YAML analysis input
 *
 * Analyzing a YAML analysis input is part of analyzing inline JavaScript code
 * within various file formats, YAML here. The function first starts by parsing
 * the YAML fle to validate its syntax and to get in return an abstract syntax
 * tree. This abstract syntax tree is then used to extract embedded JavaScript
 * code. As YAML files might embedds several JavaScript snippets, the function
 * builds an ESLint SourceCode instance for each snippet using the same utility
 * as for building source code for regular JavaScript analysis inputs. However,
 * since a YAML file can potentially produce multuple ESLint SourceCode instances,
 * the function stops to the first JavaScript parsing error and returns it without
 * considering any other. If all abstract syntax trees are valid, the function
 * then proceeds with linting each of them, aggregates, and returns the results.
 *
 * The analysis requires that global linter wrapper is initialized.
 *
 * @param input the YAML analysis input
 * @returns the YAML analysis output
 */
function analyzeYAML(input) {
    (0, eslint_1.assertLinterInitialized)();
    const sourceCodesOrError = (0, yaml_1.buildSourceCodes)(input.filePath);
    if ((0, analysis_1.isAnalysisError)(sourceCodesOrError)) {
        const parsingError = sourceCodesOrError;
        return {
            ...exports.EMPTY_YAML_ANALYSIS_OUTPUT,
            parsingError,
        };
    }
    const sourceCodes = sourceCodesOrError;
    const aggregatedIssues = [];
    for (const sourceCode of sourceCodes) {
        const { issues } = eslint_1.linter.lint(sourceCode, input.filePath, 'MAIN');
        const filteredIssues = removeYamlIssues(sourceCode, issues);
        aggregatedIssues.push(...filteredIssues);
    }
    return { issues: aggregatedIssues };
    /**
     * Filters out issues outside of JS code.
     *
     * This is necessary because we patch the SourceCode object
     * to include all the YAML files in its properties outside of its AST.
     * So rules that operate on SourceCode.text get flagged.
     */
    function removeYamlIssues(sourceCode, issues) {
        const [jsStart, jsEnd] = sourceCode.ast.range.map(offset => sourceCode.getLocFromIndex(offset));
        return issues.filter(issue => {
            const issueStart = { line: issue.line, column: issue.column };
            return isBeforeOrEqual(jsStart, issueStart) && isBeforeOrEqual(issueStart, jsEnd);
        });
        function isBeforeOrEqual(a, b) {
            if (a.line < b.line) {
                return true;
            }
            else if (a.line > b.line) {
                return false;
            }
            else {
                return a.column <= b.column;
            }
        }
    }
}
exports.analyzeYAML = analyzeYAML;
//# sourceMappingURL=analyzer.js.map