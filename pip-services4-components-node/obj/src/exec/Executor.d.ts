/** @module run */
import { IContext } from '../context/IContext';
import { Parameters } from './Parameters';
/**
 * Helper class that executes components.
 *
 * [[IExecutable]]
 */
export declare class Executor {
    /**
     * Executes specific component.
     *
     * To be executed components must implement [[IExecutable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     * @param component         the component that is to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
     *
     * @see [[IExecutable]]
     * @see [[Parameters]]
     */
    static executeOne(context: IContext, component: any, args: Parameters): Promise<any>;
    /**
     * Executes multiple components.
     *
     * To be executed components must implement [[IExecutable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     * @param components         a list of components that are to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
     *
     * @see [[executeOne]]
     * @see [[IExecutable]]
     * @see [[Parameters]]
     */
    static execute(context: IContext, components: any[], args: Parameters): Promise<any[]>;
}
