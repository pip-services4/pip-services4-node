/** @module run */

import { Parameters } from './Parameters';

/**
 * Helper class that executes components.
 * 
 * [[IExecutable]]
 */
export class Executor {
    /**
	 * Executes specific component.
	 * 
	 * To be executed components must implement [[IExecutable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 * @param component 		the component that is to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
	 * 
	 * @see [[IExecutable]]
     * @see [[Parameters]]
	 */
	public static async executeOne(correlationId: string, component: any, args: Parameters): Promise<any> {
        if (typeof component.execute === "function") {
            return await component.execute(correlationId, args);
        }
	}

    /**
	 * Executes multiple components.
	 * 
	 * To be executed components must implement [[IExecutable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 * @param components 		a list of components that are to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
	 * 
	 * @see [[executeOne]]
	 * @see [[IExecutable]]
     * @see [[Parameters]]
	 */
    public static async execute(correlationId: string, components: any[], args: Parameters): Promise<any[]> {
        let results: any[] = [];				

        for (let component of components) {
            let result = await Executor.executeOne(correlationId, component, args)
            results.push(result);
        }

        return results;
	}
}