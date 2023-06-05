/** @module services */
import { AzureFunctionAction } from './AzureFunctionAction';
/**
 * An interface that allows to integrate Azure Function controllers into Azure Function containers
 * and connect their actions to the function calls.
 */
export interface IAzureFunctionController {
    /**
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    getActions(): AzureFunctionAction[];
}
