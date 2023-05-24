/** @module commands */
import { IEvent } from './IEvent';
import { IEventListener } from './IEventListener';
import { Parameters } from '../run/Parameters';
/**
 * Concrete implementation of [[IEvent IEvent]] interface.
 * It allows to send asynchronous notifications to multiple subscribed listeners.
 *
 * @see [[IEvent]]
 * @see [[IEventListener]]
 *
 * ### Example ###
 *
 *     let event = new Event("my_event");
 *
 *     event.addListener(myListener);
 *
 *     event.notify("123", Parameters.fromTuples(
 *       "param1", "ABC",
 *       "param2", 123
 *     ));
 */
export declare class Event implements IEvent {
    private _name;
    private _listeners;
    /**
     * Creates a new event and assigns its name.
     *
     * @param name  the name of the event that is to be created.
     * @throws an Error if the name is null.
     */
    constructor(name: string);
    /**
     * Gets the name of the event.
     *
     * @returns the name of this event.
     */
    getName(): string;
    /**
     * Gets all listeners registred in this event.
     *
     * @returns a list of listeners.
     */
    getListeners(): IEventListener[];
    /**
     * Adds a listener to receive notifications when this event is fired.
     *
     * @param listener the listener reference to add.
     */
    addListener(listener: IEventListener): void;
    /**
     * Removes a listener, so that it no longer receives notifications for this event.
     *
     * @param listener      the listener reference to remove.
     */
    removeListener(listener: IEventListener): void;
    /**
     * Fires this event and notifies all registred listeners.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param args              the parameters to raise this event with.
     * @throws an [[InvocationException]] if the event fails to be raised.
     */
    notify(correlationId: string, args: Parameters): void;
}
