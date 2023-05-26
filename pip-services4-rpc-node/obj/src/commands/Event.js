"use strict";
/** @module commands */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class Event {
    /**
     * Creates a new event and assigns its name.
     *
     * @param name  the name of the event that is to be created.
     * @throws an Error if the name is null.
     */
    constructor(name) {
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
    getName() {
        return this._name;
    }
    /**
     * Gets all listeners registred in this event.
     *
     * @returns a list of listeners.
     */
    getListeners() {
        return this._listeners;
    }
    /**
     * Adds a listener to receive notifications when this event is fired.
     *
     * @param listener the listener reference to add.
     */
    addListener(listener) {
        this._listeners.push(listener);
    }
    /**
     * Removes a listener, so that it no longer receives notifications for this event.
     *
     * @param listener      the listener reference to remove.
     */
    removeListener(listener) {
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
    notify(context, args) {
        for (let i = 0; i < this._listeners.length; i++) {
            try {
                const listener = this._listeners[i];
                listener.onEvent(context, this, args);
            }
            catch (ex) {
                throw new pip_services4_commons_node_1.InvocationException(context != null ? context.getTraceId() : null, "EXEC_FAILED", "Raising event " + this.getName() + " failed: " + ex)
                    .withDetails("event", this.getName())
                    .wrap(ex);
            }
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map