import s from "../src/util/consoleStyle";
import { Context } from "../type/context";

export = ({ parser }: Context) => {
    console.log(s.mc`§1Hello TS!`);
    parser.command("hello-ts").action(async () => {
        console.log(s.mc`§1Hello TS!`);
    });
};
