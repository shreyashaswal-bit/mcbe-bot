"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const consoleStyle_1 = __importDefault(require("../src/util/consoleStyle"));
module.exports = ({ bot }) => {
    console.log(consoleStyle_1.default.mc `§1Hello TS!`);
};
