import { IDummyClient } from '../sample/IDummyClient';
export declare class DummyClientFixture {
    private port;
    private process;
    private functionName;
    private _client;
    constructor(client: IDummyClient, functionName?: string, port?: number);
    startCloudControllerLocally(): Promise<any>;
    stopCloudControllerLocally(): Promise<any>;
    testCrudOperations(): Promise<void>;
}
