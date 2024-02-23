export declare class Lock {
    status: Promise<void>;
    lock(): void;
    unlock(): void;
}
