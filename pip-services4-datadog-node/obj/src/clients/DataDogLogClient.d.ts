/** @module clients */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { RestClient } from 'pip-services4-rpc-node';
import { DataDogLogMessage } from './DataDogLogMessage';
export declare class DataDogLogClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(correlationId: string): Promise<void>;
    private convertTags;
    private convertMessage;
    private convertMessages;
    sendLogs(correlationId: string, messages: DataDogLogMessage[]): Promise<void>;
}
