/** @module clients */
import { ConfigParams } from 'pip-services4-commons-node';
import { ConfigException } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { StringConverter } from 'pip-services4-commons-node';
import { CredentialResolver } from 'pip-services4-components-node';
import { RestClient, } from 'pip-services4-rpc-node';

import { DataDogMetric } from './DataDogMetric';
import { DataDogMetricPoint} from './DataDogMetricPoint';

export class DataDogMetricsClient extends RestClient {
    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "https",
        "connection.host", "api.datadoghq.com",
        "connection.port", 443,
        "credential.internal_network", "true"
    );
    private _credentialResolver: CredentialResolver = new CredentialResolver();

    public constructor(config?: ConfigParams) {
        super();

        if (config) this.configure(config);
        this._baseRoute = "api/v1";
    }   

    public configure(config: ConfigParams): void {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }

    public setReferences(refs: IReferences): void {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }

    public async open(context): Promise<void> {
        let credential = await this._credentialResolver.lookup(context);

        if (credential == null || credential.getAccessKey() == null) {
            throw new ConfigException(
                context,
                "NO_ACCESS_KEY",
                "Missing access key in credentials"
            );
        }

        this._headers = this._headers || {};
        this._headers['DD-API-KEY'] = credential.getAccessKey();

        await super.open(context);
    }

    private convertTags(tags: any[]): string {
        if (tags == null) return null;

        let builder: string = "";

        for (let key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }

    private convertPoints(points: DataDogMetricPoint[]) {
        let result = points.map(
            (p) => {
                let time = (p.time || new Date()).getTime() / 1000;
                return [
                    StringConverter.toString(time),
                    StringConverter.toString(p.value)
                ]; 
            }
        );
        return result;
    }

    private convertMetric(metric: DataDogMetric): any {
        let tags = metric.tags;

        if (metric.service) {
            tags = tags || {};
            tags.service = metric.service;
        }

        let result = {
            "metric": metric.metric,
            "type": metric.type || 'gauge',
            "points": this.convertPoints(metric.points),
        };

        if (tags)
            result['tags'] = this.convertTags(tags);
        if (metric.host)
            result['host'] = metric.host;
        if (metric.interval)
            result['interval'] = metric.interval;

        return result;
    }

    private convertMetrics(metrics: DataDogMetric[]): any {
        let series = metrics.map((m) => { return this.convertMetric(m); });
        return {
            series: series
        };
    }

    public async sendMetrics(context: IContext, metrics: DataDogMetric[]): Promise<void> {
        let data = this.convertMetrics(metrics);

        // Commented instrumentation because otherwise it will never stop sending logs...
        //let timing = this.instrument(context, "datadog.send_metrics");
        try {
            await this.call("post", "series", null, null, data);
        } finally {
            //timing.endTiming();
        }
    }
}