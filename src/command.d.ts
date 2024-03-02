import { Command } from "commander";

import { Context } from "../types/context.js";

export const parser: Command;

export declare function parse(context: Context, argv: string[]): void;
