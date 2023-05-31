export declare class DummyCloudFunctionFixture {
    private port;
    private process;
    private functionName;
    private rest;
    constructor(functionName: string, port?: number);
    startCloudControllerLocally(): Promise<any>;
    stopCloudControllerLocally(): Promise<any>;
    protected httpInvoke(data: any): Promise<any>;
    testCrudOperations(): Promise<void>;
}
