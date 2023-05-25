/** @module run */
import { IContext } from "../context/IContext";
import { Parameters } from './Parameters';
/**
 * Helper class that notifies components.
 *
 * [[INotifiable]]
 */
export declare class Notifier {
    /**
     * Notifies specific component.
     *
     * To be notiied components must implement [[INotifiable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param component 		the component that is to be notified.
     * @param args              notifiation arguments.
     *
     * @see [[INotifiable]]
     */
    static notifyOne(context: IContext, component: any, args: Parameters): void;
    /**
     * Notifies multiple components.
     *
     * To be notified components must implement [[INotifiable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param components 		a list of components that are to be notified.
     * @param args              notification arguments.
     *
     * @see [[notifyOne]]
     * @see [[INotifiable]]
     */
    static notify(context: IContext, components: any[], args: Parameters): void;
}
