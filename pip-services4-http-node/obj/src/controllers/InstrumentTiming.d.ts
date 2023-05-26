/** @module controllers */
import { IContext } from "pip-services4-components-node";
import { ILogger } from "pip-services4-observability-node";
import { ICounters } from "pip-services4-observability-node";
import { CounterTiming } from "pip-services4-observability-node";
import { TraceTiming } from "pip-services4-observability-node";
export declare class InstrumentTiming {
    private _context;
    private _name;
    private _verb;
    private _logger;
    private _counters;
    private _counterTiming;
    private _traceTiming;
    constructor(context: IContext, name: string, verb: string, logger: ILogger, counters: ICounters, counterTiming: CounterTiming, traceTiming: TraceTiming);
    private clear;
    endTiming(err?: Error): void;
    endSuccess(): void;
    endFailure(err: Error): void;
}
