import s from "../src/util/consoleStyle";
import { Context } from "../type/context";

export = ({ bot }: Context) => {
    console.log(s.mc`§1Hello TS!`);
};
