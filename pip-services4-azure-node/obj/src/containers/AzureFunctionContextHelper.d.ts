/** @module containers */
import { Parameters } from 'pip-services4-components-node';
export declare class AzureFunctionContextHelper {
    /**
     * Returns context from Azure Function context.
     * @param context the Azure Function context
     * @return returns context from context
     */
    static getTraceId(context: any): string;
    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    static getCommand(context: any): string;
    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    static getParameters(context: any): Parameters;
}
