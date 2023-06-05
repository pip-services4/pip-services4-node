/** @module count */
/** @hidden */
import os = require('os');


import { ConfigParams, Context, ContextInfo, Descriptor, IContext, IOpenable, IReferenceable, IReferences } from 'pip-services4-components-node';

import { DataDogMetricsClient } from '../clients/DataDogMetricsClient';
import { DataDogMetric } from '../clients/DataDogMetric';
import { DataDogMetricType } from '../clients/DataDogMetricType';
import { CachedCounters, CompositeLogger, Counter, CounterType } from 'pip-services4-observability-node';

/**
 * Performance counters that send their metrics to DataDog service.
 * 
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:            (optional) connection protocol: http or https (default: https)
 *     - host:                (optional) host name or IP address (default: api.datadoghq.com)
 *     - port:                (optional) port number (default: 443)
 *     - uri:                 (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:          DataDog client api key
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.restservice.html RestService]]
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.commandablehttpservice.html CommandableHttpService]]
 * 
 * ### Example ###
 * 
 *     let counters = new DataDogCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 * 
 *     await counters.open("123");
 * 
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 * 
 *     counters.dump();
 */
export class DataDogCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _client: DataDogMetricsClient = new DataDogMetricsClient();
    private _logger = new CompositeLogger();
    private _opened = false;
    private _source: string;
    private _instance: string = os.hostname();

    /**
     * Creates a new instance of the performance counters.
     */
    public constructor() {
        super();
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);
        this._client.configure(config);

        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._client.setReferences(references);

        const contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this._opened) {
            return;
        }

        this._opened = true;

        await this._client.open(context);
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public close(context: IContext): Promise<void> {
        this._opened = false;

        return this._client.close(context);
    }

    private convertCounter(counter: Counter): DataDogMetric[] {
        switch (counter.type) {
            case CounterType.Increment:
                return [{
                    metric: counter.name,
                    type: DataDogMetricType.Gauge,
                    host: this._instance,
                    service: this._source,
                    points: [{ time: counter.time, value: counter.count }]
                }];
            case CounterType.LastValue:
                return [{
                    metric: counter.name,
                    type: DataDogMetricType.Gauge,
                    host: this._instance,
                    service: this._source,
                    points: [{ time: counter.time, value: counter.last }]
                }];
            case CounterType.Interval:
            case CounterType.Statistics:
                return [
                    {
                        metric: counter.name + ".min",
                        type: DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.min }]
                    },
                    {
                        metric: counter.name + ".average",
                        type: DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.average }]
                    },
                    {
                        metric: counter.name + ".max",
                        type: DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.max }]
                    }
                ];
        }       

        return null;
    }

    private convertCounters(counters: Counter[]): DataDogMetric[] {
        const metrics: DataDogMetric[] = [];

        for (const counter of counters) {
            const data = this.convertCounter(counter);
            if (data != null && data.length > 0)
                metrics.push(...data);
        }

        return metrics;
    }

    /**
     * Saves the current counters measurements.
     * 
     * @param counters      current counters measurements to be saves.
     */
    protected save(counters: Counter[]): void {
        const metrics = this.convertCounters(counters);
        if (metrics.length == 0) return;
        const context = Context.fromTraceId('datadog-counters');
        this._client.sendMetrics(context, metrics)
        .catch((err) => {
            this._logger.error(context, err, "Failed to push metrics to DataDog");
        });
    }
}