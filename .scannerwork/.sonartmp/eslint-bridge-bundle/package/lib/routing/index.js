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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlers_1 = require("./handlers");
const router = express_1.default.Router();
router.post('/analyze-css', handlers_1.onAnalyzeCss);
router.post('/analyze-js', handlers_1.onAnalyzeJs);
router.post('/analyze-ts', handlers_1.onAnalyzeTs);
router.post('/analyze-with-program', handlers_1.onAnalyzeWithProgram);
router.post('/analyze-yaml', handlers_1.onAnalyzeYaml);
router.post('/create-program', handlers_1.onCreateProgram);
router.post('/delete-program', handlers_1.onDeleteProgram);
router.post('/init-linter', handlers_1.onInitLinter);
router.post('/new-tsconfig', handlers_1.onNewTSConfig);
router.get('/status', handlers_1.onStatus);
router.post('/tsconfig-files', handlers_1.onTSConfigFiles);
exports.default = router;
//# sourceMappingURL=index.js.map