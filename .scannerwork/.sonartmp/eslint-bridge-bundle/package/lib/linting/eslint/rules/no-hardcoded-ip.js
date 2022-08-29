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
// https://sonarsource.github.io/rspec/#/rspec/S1313/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const net_1 = require("net");
const netMaskRegex = /(^[^\/]+)\/\d{1,3}$/;
const acceptedIpAddresses = ['255.255.255.255', '::1', '::', '0:0:0:0:0:0:0:1', '0:0:0:0:0:0:0:0'];
exports.rule = {
    meta: {
        messages: {
            checkIP: 'Make sure using a hardcoded IP address {{ip}} is safe here.',
        },
    },
    create(context) {
        function isException(ip) {
            return (ip.startsWith('127.') ||
                ip.startsWith('0.') ||
                // avoid FP for OID http://www.oid-info.com/introduction.htm
                ip.startsWith('2.5') ||
                acceptedIpAddresses.includes(ip));
        }
        function isIPV4OctalOrHex(ip) {
            const digits = ip.split('.');
            if (digits.length !== 4) {
                return false;
            }
            const decimalDigits = [];
            for (const digit of digits) {
                if (digit.match(/^0[0-7]*$/)) {
                    decimalDigits.push(parseInt(digit, 8));
                }
                else if (digit.match(/^0[xX][0-9a-fA-F]+$/)) {
                    decimalDigits.push(parseInt(digit, 16));
                }
                else {
                    return false;
                }
            }
            const convertedIp = `${decimalDigits[0]}.${decimalDigits[1]}.${decimalDigits[2]}.${decimalDigits[3]}`;
            return !isException(convertedIp) && (0, net_1.isIP)(convertedIp) !== 0;
        }
        return {
            Literal(node) {
                const { value } = node;
                if (typeof value !== 'string') {
                    return;
                }
                let ip = value;
                const result = value.match(netMaskRegex);
                if (result) {
                    ip = result[1];
                }
                if ((!isException(ip) && (0, net_1.isIP)(ip) !== 0) || isIPV4OctalOrHex(ip)) {
                    context.report({
                        node,
                        messageId: 'checkIP',
                        data: {
                            ip: value,
                        },
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-hardcoded-ip.js.map