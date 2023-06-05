/** @module clients */
import { ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { RestClient } from 'pip-services4-http-node';
import { DataDogLogMessage } from './DataDogLogMessage';
export declare class DataDogLogClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(context: IContext): Promise<void>;
    private convertTags;
    private convertMessage;
    private convertMessages;
    sendLogs(context: IContext, messages: DataDogLogMessage[]): Promise<void>;
}
