/** @module refer */
import { InternalException } from 'pip-services4-commons-node';
import { IContext } from '../context/IContext';
/**
 * Error when required component dependency cannot be found.
 */
export declare class ReferenceException extends InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param locator             the locator to find reference to dependent component.
     */
    constructor(context: IContext, locator: any);
}
