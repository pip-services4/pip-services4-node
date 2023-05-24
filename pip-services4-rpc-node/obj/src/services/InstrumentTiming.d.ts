/** @module services */
import { ILogger } from "pip-services4-components-node";
import { ICounters } from "pip-services4-components-node";
import { CounterTiming } from "pip-services4-components-node";
import { TraceTiming } from "pip-services4-components-node";
export declare class InstrumentTiming {
    private _correlationId;
    private _name;
    private _verb;
    private _logger;
    private _counters;
    private _counterTiming;
    private _traceTiming;
    constructor(correlationId: string, name: string, verb: string, logger: ILogger, counters: ICounters, counterTiming: CounterTiming, traceTiming: TraceTiming);
    private clear;
    endTiming(err?: Error): void;
    endSuccess(): void;
    endFailure(err: Error): void;
}
