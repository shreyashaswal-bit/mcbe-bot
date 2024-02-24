import { Command } from "commander";
import { Bot } from "./bot.js";

export const parser: Command;

export declare function parse(bot: Bot, argv: string[]): void;
