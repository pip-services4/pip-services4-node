/** @module run */
import { IContext } from "../context/IContext";
import { IClosable } from "../run/IClosable";
import { INotifiable } from './INotifiable';
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
export declare class FixedRateTimer implements IClosable {
    private _task;
    private _callback;
    private _delay;
    private _interval;
    private _timer;
    private _timeout;
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
    constructor(taskOrCallback?: any, interval?: number, delay?: number);
    /**
     * Gets the INotifiable object that receives notifications from this timer.
     *
     * @returns the INotifiable object or null if it is not set.
     */
    getTask(): INotifiable;
    /**
     * Sets a new INotifiable object to receive notifications from this timer.
     *
     * @param value a INotifiable object to be triggered.
     */
    setTask(value: INotifiable): void;
    /**
     * Gets the callback function that is called when this timer is triggered.
     *
     * @returns the callback function or null if it is not set.
     */
    getCallback(): () => void;
    /**
     * Sets the callback function that is called when this timer is triggered.
     *
     * @param value the callback function to be called.
     */
    setCallback(value: () => void): void;
    /**
     * Gets initial delay before the timer is triggered for the first time.
     *
     * @returns the delay in milliseconds.
     */
    getDelay(): number;
    /**
     * Sets initial delay before the timer is triggered for the first time.
     *
     * @param value a delay in milliseconds.
     */
    setDelay(value: number): void;
    /**
     * Gets periodic timer triggering interval.
     *
     * @returns the interval in milliseconds
     */
    getInterval(): number;
    /**
     * Sets periodic timer triggering interval.
     *
     * @param value an interval in milliseconds.
     */
    setInterval(value: number): void;
    /**
     * Checks if the timer is started.
     *
     * @returns true if the timer is started and false if it is stopped.
     */
    isStarted(): boolean;
    /**
     * Starts the timer.
     *
     * Initially the timer is triggered after delay.
     * After that it is triggered after interval until it is stopped.
     *
     * @see [[stop]]
     */
    start(): void;
    /**
     * Stops the timer.
     *
     * @see [[start]]
     */
    stop(): void;
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
    close(context: IContext): Promise<void>;
}
