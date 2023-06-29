/** @module commands */

import { ContextResolver, IContext } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { InvocationException } from 'pip-services4-commons-node';

import { IEvent } from './IEvent';
import { IEventListener } from './IEventListener';

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
export class Event implements IEvent {
    private _name: string;
    private _listeners: IEventListener[];

    /**
     * Creates a new event and assigns its name.
     * 
     * @param name  the name of the event that is to be created.
     * @throws an Error if the name is null.
     */
    public constructor(name: string) {
        if (name == null) {
            throw new Error("Name cannot be null");
        }

        this._name = name;
        this._listeners = [];
    }

    /**
     * Gets the name of the event.
     * 
     * @returns the name of this event.
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Gets all listeners registred in this event.
     * 
     * @returns a list of listeners.
     */
    public getListeners(): IEventListener[] {
        return this._listeners;
    }

    /**
     * Adds a listener to receive notifications when this event is fired.
     * 
     * @param listener the listener reference to add.
     */
    public addListener(listener: IEventListener): void {
        this._listeners.push(listener);
    }

    /**
     * Removes a listener, so that it no longer receives notifications for this event.
     * 
     * @param listener      the listener reference to remove.
     */
    public removeListener(listener: IEventListener): void {
        const index = this._listeners.indexOf(listener);

        if (index > -1) {
            this._listeners.splice(index, 1);
        }
    }

    /**
     * Fires this event and notifies all registred listeners.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param args              the parameters to raise this event with.
     * @throws an [[InvocationException]] if the event fails to be raised.  
     */
    public notify(context: IContext, args: Parameters): void {
        for (let i = 0; i < this._listeners.length; i++) {
            try {
                const listener: IEventListener = this._listeners[i];
                listener.onEvent(context, this, args);
            } catch (ex) {
                throw new InvocationException(
                    context != null ? ContextResolver.getTraceId(context) : null,
                    "EXEC_FAILED",
                    "Raising event " + this.getName() + " failed: " + ex)
                    .withDetails("event", this.getName())
                    .wrap(ex);
            }
        }
    }
}
