import { EventEmitter } from "events";
import { EventFinally } from "../event/event";

export declare function emitEx(
    emitter: EventEmitter,
    event_name: string,
    param: any,
    succeed: void | ((new_data) => void),
): EventFinally;
