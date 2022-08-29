"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSourceCodes = void 0;
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
const eslint_1 = require("eslint");
const analysis_1 = require("services/analysis");
const jsts_1 = require("parsing/jsts");
const yaml_1 = require("parsing/yaml");
const patch_1 = require("./patch");
/**
 * Builds ESLint SourceCode instances for every embedded JavaScript snippet in the YAML file.
 *
 * If there is at least one parsing error in any snippet, we return only the first error and
 * we don't even consider any parsing errors in the remaining snippets for simplicity.
 */
function buildSourceCodes(filePath) {
    const embeddedJSsOrError = (0, yaml_1.parseAwsFromYaml)(filePath);
    if ((0, analysis_1.isAnalysisError)(embeddedJSsOrError)) {
        return embeddedJSsOrError;
    }
    const embeddedJSs = embeddedJSsOrError;
    const sourceCodes = [];
    for (const embeddedJS of embeddedJSs) {
        const { code } = embeddedJS;
        /**
         * The file path is purposely left empty as it is ignored by `buildSourceCode` if
         * the file content is provided, which happens to be the case here since `code`
         * denotes an embedded JavaScript snippet extracted from the YAML file.
         */
        const input = { filePath: '', fileContent: code, fileType: 'MAIN' };
        const sourceCodeOrError = (0, jsts_1.buildSourceCode)(input, 'js');
        if (sourceCodeOrError instanceof eslint_1.SourceCode) {
            const sourceCode = sourceCodeOrError;
            const patchedSourceCode = (0, patch_1.patchSourceCode)(sourceCode, embeddedJS);
            sourceCodes.push(patchedSourceCode);
        }
        else {
            const parsingError = sourceCodeOrError;
            return (0, patch_1.patchParsingError)(parsingError, embeddedJS);
        }
    }
    return sourceCodes;
}
exports.buildSourceCodes = buildSourceCodes;
//# sourceMappingURL=build.js.map