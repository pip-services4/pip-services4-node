/** @module run */
import { IContext } from "../context/IContext";
import { Parameters } from './Parameters';
/**
 * Interface for components that can be called to execute work.
 *
 * @see [[Executor]]
 * @see [[INotifiable]]
 * @see [[Parameters]]
 *
 * ### Example ###
 *
 *     class EchoComponent implements IExecutable {
 *         ...
 *         public async execute(context: IContext, args: Parameters): Promise<any> {
 *             let result = args.getAsObject("message");
 *             return result;
 *         }
 *     }
 *
 *     let echo = new EchoComponent();
 *     let message = "Test";
 *     let result = await echo.execute("123", Parameters.fromTuples("message", message))
 *     console.log("Request: " + message + " Response: " + result);
 */
export interface IExecutable {
    /**
     * Executes component with arguments and receives execution result.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param args 				execution arguments.
     * @result 					the execution result.
     */
    execute(context: IContext, args: Parameters): Promise<any>;
}
