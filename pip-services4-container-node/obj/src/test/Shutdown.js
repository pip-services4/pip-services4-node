"use strict";
/** @module test */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shutdown = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class Shutdown {
    /**
     * Creates a new instance of the shutdown component.
     */
    constructor() {
        this._mode = 'exception';
        this._minTimeout = 300000;
        this._maxTimeout = 900000;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._mode = config.getAsStringWithDefault('mode', this._mode);
        this._minTimeout = config.getAsIntegerWithDefault('min_timeout', this._minTimeout);
        this._maxTimeout = config.getAsIntegerWithDefault('max_timeout', this._maxTimeout);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._interval != null;
    }
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._interval != null) {
                clearInterval(this._interval);
            }
            const timeout = this.nextTimeout(this._minTimeout, this._maxTimeout);
            this._interval = setInterval(() => {
                this.shutdown();
            }, timeout);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._interval != null) {
                clearInterval(this._interval);
                this._interval = null;
            }
        });
    }
    nextTimeout(min, max = null) {
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
    shutdown() {
        if (this._mode == 'null' || this._mode == 'nullpointer') {
            const obj = null;
            obj.crash = 123;
        }
        else if (this._mode == 'zero' || this._mode == 'dividebyzero') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const crash = 0 / 100;
        }
        else if (this._mode == 'exit' || this._mode == 'processexit') {
            process.exit(1);
        }
        else {
            const err = new pip_services4_commons_node_1.ApplicationException('test', null, 'CRASH', 'Crash test exception');
            throw err;
        }
    }
}
exports.Shutdown = Shutdown;
//# sourceMappingURL=Shutdown.js.map