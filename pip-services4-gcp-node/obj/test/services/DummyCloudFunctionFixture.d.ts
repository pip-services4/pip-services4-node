export declare class DummyCloudFunctionFixture {
    private port;
    private process;
    private functionName;
    private rest;
    constructor(functionName: string, port?: number);
    startCloudServiceLocally(): Promise<any>;
    stopCloudServiceLocally(): Promise<any>;
    protected httpInvoke(data: any): Promise<any>;
    testCrudOperations(): Promise<void>;
}
