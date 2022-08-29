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
exports.start = void 0;
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const routing_1 = __importDefault(require("routing"));
const helpers_1 = require("helpers");
/**
 * The maximum request body size
 */
const MAX_REQUEST_SIZE = '50mb';
/**
 * Starts the bridge
 *
 * The bridge is an Express.js web server that exposes several services
 * through a REST API. Once started, the bridge first begins by loading
 * any provided rule bundles and then waits for incoming requests.
 *
 * Communication between two ends is entirely done with the JSON format.
 *
 * Altough a web server, the bridge is not exposed to the outside world
 * but rather exclusively communicate either with the JavaScript plugin
 * which embedds it or directly with SonarLint.
 *
 * @param port the port to listen to
 * @param host the host to listen to
 * @returns an http server
 */
function start(port = 0, host = '127.0.0.1') {
    return new Promise(resolve => {
        (0, helpers_1.debug)(`starting eslint-bridge server at port ${port}`);
        const app = (0, express_1.default)();
        let server;
        app.use(express_1.default.json({ limit: MAX_REQUEST_SIZE }));
        app.use(routing_1.default);
        app.post('/close', (_request, response) => {
            (0, helpers_1.debug)('eslint-bridge server will shutdown');
            response.end(() => {
                server.close();
            });
        });
        server = app.listen(port, host, () => {
            (0, helpers_1.debug)(`eslint-bridge server is running at port ${port}`);
            resolve(server);
        });
    });
}
exports.start = start;
//# sourceMappingURL=server.js.map