import { IDummyClient } from '../IDummyClient';
export declare class DummyClientFixture {
    private port;
    private process;
    private functionName;
    private _client;
    constructor(client: IDummyClient, functionName?: string, port?: number);
    startCloudServiceLocally(): Promise<any>;
    stopCloudServiceLocally(): Promise<any>;
    testCrudOperations(): Promise<void>;
}
