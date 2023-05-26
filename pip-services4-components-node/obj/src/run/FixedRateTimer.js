"use strict";
/** @module run */
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
exports.FixedRateTimer = void 0;
const context_1 = require("../context");
const Parameters_1 = require("./Parameters");
/**
 * Timer that is triggered in equal time intervals.
 *
 * It has summetric cross-language implementation
 * and is often used by Pip.Services toolkit to
 * perform periodic processing and cleanup in microservices.
 *
 * @see [[INotifiable]]
 *
 * ### Example ###
 *
 *     class MyComponent {
 *         private timer: FixedRateTimer = new FixedRateTimer(() => { this.cleanup }, 60000);
 *         ...
 *         public async open(context: IContext): Promise<void> {
 *             ...
 *             timer.start();
 *             ...
 *         }
 *
 *         public async close(context: IContext): Promise<void> {
 *             ...
 *             timer.stop();
 *             ...
 *         }
 *
 *         private cleanup(): void {
 *             ...
 *         }
 *         ...
 *     }
 */
class FixedRateTimer {
    /**
     * Creates new instance of the timer and sets its values.
     *
     * @param taskOrCallback    (optional) a Notifiable object or callback function to call when timer is triggered.
     * @param interval          (optional) an interval to trigger timer in milliseconds.
     * @param delay             (optional) a delay before the first triggering in milliseconds.
     *
     * @see [[setTask]]
     * @see [[setCallback]]
     * @see [[setInterval]]
     * @see [[setDelay]]
     */
    constructor(taskOrCallback = null, interval = null, delay = null) {
        if (taskOrCallback != null && typeof taskOrCallback === "object" && typeof taskOrCallback.notify === "function") {
            this.setTask(taskOrCallback);
        }
        else {
            this.setCallback(taskOrCallback);
        }
        this.setInterval(interval);
        this.setDelay(delay);
    }
    /**
     * Gets the INotifiable object that receives notifications from this timer.
     *
     * @returns the INotifiable object or null if it is not set.
     */
    getTask() {
        return this._task;
    }
    /**
     * Sets a new INotifiable object to receive notifications from this timer.
     *
     * @param value a INotifiable object to be triggered.
     */
    setTask(value) {
        this._task = value;
        this._callback = () => {
            this._task.notify(new context_1.Context({ trace_id: "pip-commons-timer" }), new Parameters_1.Parameters());
        };
    }
    /**
     * Gets the callback function that is called when this timer is triggered.
     *
     * @returns the callback function or null if it is not set.
     */
    getCallback() {
        return this._callback;
    }
    /**
     * Sets the callback function that is called when this timer is triggered.
     *
     * @param value the callback function to be called.
     */
    setCallback(value) {
        this._callback = value;
        this._task = null;
    }
    /**
     * Gets initial delay before the timer is triggered for the first time.
     *
     * @returns the delay in milliseconds.
     */
    getDelay() {
        return this._delay;
    }
    /**
     * Sets initial delay before the timer is triggered for the first time.
     *
     * @param value a delay in milliseconds.
     */
    setDelay(value) {
        this._delay = value;
    }
    /**
     * Gets periodic timer triggering interval.
     *
     * @returns the interval in milliseconds
     */
    getInterval() {
        return this._interval;
    }
    /**
     * Sets periodic timer triggering interval.
     *
     * @param value an interval in milliseconds.
     */
    setInterval(value) {
        this._interval = value;
    }
    /**
     * Checks if the timer is started.
     *
     * @returns true if the timer is started and false if it is stopped.
     */
    isStarted() {
        return this._timer != null;
    }
    /**
     * Starts the timer.
     *
     * Initially the timer is triggered after delay.
     * After that it is triggered after interval until it is stopped.
     *
     * @see [[stop]]
     */
    start() {
        // Stop previously set timer
        this.stop();
        // Exit if interval is not defined
        if (this._interval == null || this._interval <= 0)
            return;
        // Introducing delay
        const delay = Math.max(0, this._delay - this._interval);
        this._timeout = setTimeout(() => {
            this._timeout = null;
            // Set a new timer
            this._timer = setInterval(() => {
                try {
                    if (this._callback)
                        this._callback();
                }
                catch (ex) {
                    // Ignore or better log!
                }
            }, this._interval);
        }, delay);
    }
    /**
     * Stops the timer.
     *
     * @see [[start]]
     */
    stop() {
        if (this._timeout != null) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        if (this._timer != null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
    /**
     * Closes the timer.
     *
     * This is required by [[ICloseable]] interface,
     * but besides that it is identical to stop().
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param callback             callback function that receives error or null no errors occured.
     *
     * @see [[stop]]
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop();
        });
    }
}
exports.FixedRateTimer = FixedRateTimer;
//# sourceMappingURL=FixedRateTimer.js.map