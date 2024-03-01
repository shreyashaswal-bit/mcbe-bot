type callback = (new_data: void | object) => void;
type EventFinally = {
    eventSucceed: boolean;
    newData: any;
};

export declare class Event {
    isSuccess: boolean;
    _callback: callback;

    constructor(callback: callback);

    reject(): void;
    update(new_data: any): void;
    finish(): never;

    /**
     * 事件传递完毕后调用,返回事件是否成功
     * @returns {EventFinally}
     */
    _finally(): EventFinally;
}
