/** @module commands */

import { IContext } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';

import { IEvent } from './IEvent';

/**
 * An interface for listener objects that receive notifications on fired events.
 * 
 * @see [[IEvent]]
 * @see [[Event]]
 * 
 * ### Example ###
 * 
 *     export class MyListener implements IEventListener {
 *         private onEvent(context: IContext, event: IEvent, args: Parameters): void {
 *             console.log("Fired event " + event.getName());
 *         }
 *     }
 *     
 *     let event = new Event("myevent");
 *     event.addListener(new MyListener());
 *     event.notify("123", Parameters.fromTuples("param1", "ABC"));
 *     
 *     // Console output: Fired event myevent
 */
export interface IEventListener {
    /**
     * A method called when events this listener is subscrubed to are fired.
     * 
     * @param event             a fired evemt
     * @param context     (optional) execution context to trace execution through call chain.
     * @param args                 event arguments.
     */
    onEvent(context: IContext, event: IEvent, args: Parameters): void;
}
