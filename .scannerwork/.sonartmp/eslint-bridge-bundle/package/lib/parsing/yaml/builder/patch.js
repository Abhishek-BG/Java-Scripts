"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchParsingErrorMessage = exports.patchParsingError = exports.patchSourceCode = void 0;
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
const eslint_2 = require("linting/eslint");
/**
 * Patches the ESLint SourceCode instance parsed with an ESLint-based parser
 *
 * Patching an ESLint SourceCode instance denoting an embedded JavaScript snippet implies
 * fixing all location-related data structures in the abstract syntax tree as well as the
 * behavior of the instance methods because they are relative to the beginning of the code
 * snippet that was parsed, not relative to the whole YAML file content. By doing so,
 * location-related information within reported issues and quick fixes will be relative to
 * the YAML file (YAML referential).
 */
function patchSourceCode(originalSourceCode, embeddedJS) {
    /**
     * 1. Recomputes the lines from the original YAML file content, as the lines in the original
     *    SourceCode include only those from the embedded JavaScript code snippet and these
     *    lines are used internally by the SourceCode for various purposes.
     */
    const lines = computeLines();
    /**
     * 2. Overrides the values `lineStartIndices`, `text` and `lines` of the original SourceCode
     *    instance from the JavaScript referential to the YAML one. To achieve that, we must use
     *    `Object.create()` because these particular SourceCode's properties are frozen.
     */
    const patchedSourceCode = Object.create(originalSourceCode, {
        lineStartIndices: { value: embeddedJS.lineStarts },
        text: { value: embeddedJS.text },
        lines: { value: lines },
    });
    /**
     * 3. Patches the location information of the SourceCode's abstract syntax tree as it sill
     *    in the JavaScript referential
     */
    patchASTLocations(patchedSourceCode, embeddedJS.offset);
    /**
     * 4. Rebuilds the SourceCode from the patched values because
     *    it builds internal properties that are depending on them
     */
    return new eslint_1.SourceCode({
        text: patchedSourceCode.text,
        ast: patchedSourceCode.ast,
        parserServices: patchedSourceCode.parserServices,
        scopeManager: patchedSourceCode.scopeManager,
        visitorKeys: patchedSourceCode.visitorKeys,
    });
    /* Taken from eslint/lib/source-code/source-code.js#constructor */
    function computeLines() {
        const lineBreakPattern = /\r\n|[\r\n\u2028\u2029]/u;
        const lineEndingPattern = new RegExp(lineBreakPattern.source, 'gu');
        const lines = [];
        let i = 0;
        let match;
        while ((match = lineEndingPattern.exec(embeddedJS.text))) {
            lines.push(embeddedJS.text.slice(embeddedJS.lineStarts[i], match.index));
            i++;
        }
        lines.push(embeddedJS.text.slice(embeddedJS.lineStarts[embeddedJS.lineStarts.length - 1]));
        return lines;
    }
    /**
     * Patches the location in the abstract syntax tree from the embedded JavaScript snippet
     *
     * The patching involves any kind of nodes with locations and ranges, that is, regular
     * nodes, comments, and tokens.
     */
    function patchASTLocations(sourceCode, offset) {
        (0, eslint_2.visit)(sourceCode, node => {
            fixNodeLocation(node);
        });
        const { comments } = sourceCode.ast;
        for (const comment of comments) {
            fixNodeLocation(comment);
        }
        const { tokens } = sourceCode.ast;
        for (const token of tokens) {
            fixNodeLocation(token);
        }
        function fixNodeLocation(node) {
            if (node.loc != null && node.range != null) {
                node.loc = {
                    start: sourceCode.getLocFromIndex(node.range[0] + offset),
                    end: sourceCode.getLocFromIndex(node.range[1] + offset),
                };
            }
            if (node.range) {
                const [sRange, eRange] = node.range;
                node.range = [sRange + offset, eRange + offset];
            }
        }
    }
}
exports.patchSourceCode = patchSourceCode;
/**
 * Patches a parsing error in an embedded JavaScript snippet
 *
 * Patching a parsing error in such a snippet requires patching the line number of the error
 * as well as its message if it includes location information like a token position. At this,
 * point, location information in the parsing error is relative to the beginning of the code
 * snippet, which should be patched.
 */
function patchParsingError(parsingError, embeddedJS) {
    const { code, line, message } = parsingError;
    let patchedLine;
    let patchedMessage = message;
    if (line) {
        patchedLine = embeddedJS.format === 'PLAIN' ? embeddedJS.line : embeddedJS.line + line;
        patchedMessage = patchParsingErrorMessage(message, patchedLine, embeddedJS);
    }
    return {
        code,
        line: patchedLine,
        message: patchedMessage,
    };
}
exports.patchParsingError = patchParsingError;
/**
 * Patches the message of a parsing error in an embedded JavaScript snippet
 *
 * A parsing error reported by an ESLint-based parser generally includes location information
 * about an unexpected token, e.g., `Unexpected token ','. (7:22)`, which should be patched.
 */
function patchParsingErrorMessage(message, patchedLine, embeddedJS) {
    /* Extracts location information of the form `(<line>:<column>)` */
    const regex = /((?<line>\d+):(?<column>\d+))/;
    const found = message.match(regex);
    if (found !== null && found.groups) {
        const line = found.groups.line;
        const column = Number(found.groups.column);
        const patchedColumn = embeddedJS.format === 'PLAIN' ? column + embeddedJS.column - 1 : column;
        return message.replace(`(${line}:${column})`, `(${patchedLine}:${patchedColumn})`);
    }
    return message;
}
exports.patchParsingErrorMessage = patchParsingErrorMessage;
//# sourceMappingURL=patch.js.map