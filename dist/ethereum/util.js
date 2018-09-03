"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const bignumber_js_1 = require("bignumber.js");
exports.gWei = new bignumber_js_1.default(10).pow(9);
exports.hexToNumber = (hex) => {
    if (hex === "0x") {
        return 0;
    }
    return Number.parseInt(hex, 16);
};
exports.hexToDecimalString = (hex) => {
    if (hex === "0x") {
        return "0";
    }
    if (!hex.startsWith("0x")) {
        hex = "0x" + hex;
    }
    return new bignumber_js_1.default(hex).toString(10);
};
exports.toWei = (eth) => {
    const tmp = new bignumber_js_1.default(10).pow(18);
    return new bignumber_js_1.default(eth).times(tmp).toString(10);
};
exports.toEth = (wei) => {
    const tmp = new bignumber_js_1.default(10).pow(18);
    return new bignumber_js_1.default(wei).div(tmp).toString(10);
};
exports.numberToHex = (int) => {
    return "0x" + new bignumber_js_1.default(int).toString(16);
};
exports.addHexPad = (hex) => {
    if (!hex.startsWith("0x")) {
        hex = "0x" + hex;
    }
    return hex;
};
exports.ERC20FuncSig = {
    allowance: "0xdd62ed3e",
    approve: "0x095ea7b3",
    balanceOf: "0x70a08231",
    decimals: "0x313ce567",
    name: "0x06fdde03",
    symbol: "0x95d89b41",
    totalSupply: "0x18160ddd",
    transfer: "0xa9059cbb",
    transferFrom: "0x23b872dd"
};
exports.ERC20FuncSigUpper = {
    DECIMALS: "0x2e0f2625",
    NAME: "0xa3f4df7e",
    SYMBOL: "0xf76f8d78"
};
exports.ERC20EventSig = {
    Approve: "0xdf586a81df66595b89d3dbd58e5b14ee6c0fb16da8977f97ea7d24c654994ac7",
    Transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
};
exports.ERC721FunSig = {
    name: "0x06fdde03",
    symbol: "0x95d89b41",
    totalSupply: "0x18160ddd",
    // safeTransferFrom(address,address,uint256)
    safeTransferFrom: "0x42842e0e",
    // safeTransferFrom(address,address,uint256,bytes)
    safeTransferFromWithData: "0x42842e0e",
    // transferFrom(address,address,uint256)
    transferFrom: "0x23b872dd"
};
exports.isAddress = (address) => {
    return /^(0x)?[0-9a-f]{40}$/.test(address.toLowerCase());
};
exports.padAddress = (address) => {
    if (!exports.isAddress(address)) {
        throw new Error("Not a valid address");
    }
    return "0".repeat(24) + address.replace("0x", "");
};
exports.toUtf8 = (hex) => {
    const result = Buffer.from(hex.replace("0x", ""), "hex")
        .toString()
        .match(/\w+/g);
    return result ? result.join("") : "";
};
exports.addressNull = "0x0000000000000000000000000000000000000000";
/**
 * Get Eth Token ABI from EtherScan.io
 * @param token tokenAddress
 * @returns { status: string, message: string, result: string}
 * if status isn't "1" then the request is failed
 * the result is ABI JSON string,you should use JSON.parse()
 * type defined of ABI struct can be found in
 * defined/eth.d.ts => Ethereum.IAbiStruct
 */
exports.getABI = async (token, apiKey = "YourApiKeyToken") => {
    const api = "https://api.etherscan.io/api";
    try {
        const { data } = await axios_1.default.get(api, {
            params: {
                module: "contract",
                action: "getabi",
                address: token,
                apiKey
            }
        });
        if (data.status === "0") {
            return null;
        }
        return JSON.parse(data.result);
    }
    catch (e) {
        throw new Error(e.message);
    }
};
exports.getRecommendGasPrice = async (apiKey = "YourApiKeyToken") => {
    const api = "https://api.etherscan.io/api";
    const { data } = await axios_1.default.get(api, {
        params: {
            module: "proxy",
            action: "eth_gasPrice",
            apiKey
        }
    });
    const tmp = new bignumber_js_1.default(data.result, 16).div(exports.gWei);
    if (tmp.lt(20)) {
        return "20";
    }
    return tmp.times(1.2).toFixed(0);
};
