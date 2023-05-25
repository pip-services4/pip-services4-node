/** @module clients */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { RestClient } from 'pip-services4-rpc-node';
import { DataDogMetric } from './DataDogMetric';
export declare class DataDogMetricsClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(context: any): Promise<void>;
    private convertTags;
    private convertPoints;
    private convertMetric;
    private convertMetrics;
    sendMetrics(context: IContext, metrics: DataDogMetric[]): Promise<void>;
}
