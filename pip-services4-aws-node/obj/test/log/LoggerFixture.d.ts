import { CachedLogger } from 'pip-services4-components-node';
export declare class LoggerFixture {
    private _logger;
    constructor(logger: CachedLogger);
    testLogLevel(): void;
    testSimpleLogging(): Promise<void>;
    testErrorLogging(): Promise<void>;
}
