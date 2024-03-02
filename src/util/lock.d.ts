export declare class Lock {
    private callback: (value: any) => void;
    status: Promise<void>;
    lock(): void;
    unlock(): void;
}
