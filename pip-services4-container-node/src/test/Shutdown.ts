/** @module test */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from "pip-services4-components-node";
import { IConfigurable } from "pip-services4-components-node";
import { IOpenable } from "pip-services4-components-node";
import { ApplicationException } from "pip-services4-commons-node";

/**
 * Random shutdown component that crashes the process
 * using various methods.
 * 
 * The component is usually used for testing, but brave developers
 * can try to use it in production to randomly crash microservices.
 * It follows the concept of "Chaos Monkey" popularized by Netflix.
 * 
 * ### Configuration parameters ###
 * 
 * - mode:          null - crash by NullPointer excepiton, zero - crash by dividing by zero, excetion = crash by unhandled exception, exit - exit the process
 * - min_timeout:   minimum crash timeout in milliseconds (default: 5 mins)
 * - max_timeout:   maximum crash timeout in milliseconds (default: 15 minutes)
 * 
 * ### Example ###
 * 
 *     let shutdown = new Shutdown();
 *     shutdown.configure(ConfigParams.fromTuples(
 *         "mode": "exception"
 *     ));
 *     shutdown.shutdown();         // Result: Bang!!! the process crashes
 */
export class Shutdown implements IConfigurable, IOpenable {
    private _interval: any;
    private _mode: string = 'exception';
    private _minTimeout: number = 300000;
    private _maxTimeout: number = 900000;

    /**
     * Creates a new instance of the shutdown component.
     */
    public constructor() {}

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._mode = config.getAsStringWithDefault('mode', this._mode);
        this._minTimeout = config.getAsIntegerWithDefault('min_timeout', this._minTimeout);
        this._maxTimeout = config.getAsIntegerWithDefault('max_timeout', this._maxTimeout);
    }

	/**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
	 */
    public isOpen(): boolean {
        return this._interval != null;
    }

	/**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 */
    public async open(context: IContext): Promise<void> {
        if (this._interval != null) {
            clearInterval(this._interval);
        }

        let timeout = this.nextTimeout(this._minTimeout, this._maxTimeout);
        this._interval = setInterval(() => {
            this.shutdown();
        }, timeout);
    }

	/**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 */
    public async close(context: IContext): Promise<void> {
        if (this._interval != null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    private nextTimeout(min: number, max: number = null): number {
        if (max == null) {
            max = min;
            min = 0;
        }

        if (max - min <= 0) {
            return min;
        }

        return Math.floor(min + Math.random() * (max - min));
    }
    
    /**
     * Crashes the process using the configured crash mode.
     */
    public shutdown(): void {
        if (this._mode == 'null' || this._mode == 'nullpointer') {
            let obj = null;
            obj.crash = 123;
        } else if (this._mode == 'zero' || this._mode == 'dividebyzero') {
            let crash = 0 / 100;
        } else if (this._mode == 'exit' || this._mode == 'processexit') {
            process.exit(1);
        } else {
            let err = new ApplicationException('test', null, 'CRASH', 'Crash test exception');
            throw err;
        }
    }
}