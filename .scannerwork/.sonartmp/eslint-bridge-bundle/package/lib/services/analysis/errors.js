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
exports.isAnalysisError = exports.parseAnalysisErrorCode = exports.AnalysisErrorCode = void 0;
/**
 * The possible codes of analysis errors
 *
 * The `GeneralError` value denotes a runtime error which is either
 * unpredicatble or occurs rarely to deserve its own category.
 */
var AnalysisErrorCode;
(function (AnalysisErrorCode) {
    AnalysisErrorCode["Parsing"] = "PARSING";
    AnalysisErrorCode["MissingTypeScript"] = "MISSING_TYPESCRIPT";
    AnalysisErrorCode["UnsupportedTypeScript"] = "UNSUPPORTED_TYPESCRIPT";
    AnalysisErrorCode["FailingTypeScript"] = "FAILING_TYPESCRIPT";
    AnalysisErrorCode["GeneralError"] = "GENERAL_ERROR";
})(AnalysisErrorCode = exports.AnalysisErrorCode || (exports.AnalysisErrorCode = {}));
/**
 * Infers the code of an analysis error based on the error message
 *
 * By default, any error which doesn't denotes a set of well-identified
 * runtime errors is always classified as a parsing error.
 *
 * @param error an error message
 * @returns the corresponding analysis error code
 */
function parseAnalysisErrorCode(error) {
    if (error.startsWith("Cannot find module 'typescript'")) {
        return AnalysisErrorCode.MissingTypeScript;
    }
    else if (error.startsWith('You are using version of TypeScript')) {
        return AnalysisErrorCode.UnsupportedTypeScript;
    }
    else if (error.startsWith('Debug Failure')) {
        return AnalysisErrorCode.FailingTypeScript;
    }
    else {
        return AnalysisErrorCode.Parsing;
    }
}
exports.parseAnalysisErrorCode = parseAnalysisErrorCode;
/**
 * A type guard for potential analysis errors
 * @param maybeError the potential error to type guard
 * @returns true if it is an actual error
 */
function isAnalysisError(maybeError) {
    return 'code' in maybeError;
}
exports.isAnalysisError = isAnalysisError;
//# sourceMappingURL=errors.js.map