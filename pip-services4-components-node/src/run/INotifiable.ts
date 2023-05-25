/** @module run */

import { IContext } from "../context/IContext";
import { Parameters } from './Parameters';

/**
 * Interface for components that can be asynchronously notified.
 * The notification may include optional argument that describe
 * the occured event.
 * 
 * @see [[Notifier]]
 * @see [[IExecutable]]
 * 
 * ### Example ###
 * 
 *     class MyComponent implements INotifable {
 *         ...
 *         public notify(context: IContext, args: Parameters): void {
 *             console.log("Occured event " + args.getAsString("event"));
 *         }
 *     }
 *     
 *     let myComponent = new MyComponent();
 *     
 *     myComponent.notify("123", Parameters.fromTuples("event", "Test Event"));
 */
export interface INotifiable {
	/**
	 * Notifies the component about occured event.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 * @param args 				notification arguments.
	 */
	notify(context: IContext, args: Parameters): void;
}
