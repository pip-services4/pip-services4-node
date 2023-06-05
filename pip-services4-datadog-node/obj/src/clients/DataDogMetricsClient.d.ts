/** @module clients */
import { ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { RestClient } from 'pip-services4-http-node';
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
