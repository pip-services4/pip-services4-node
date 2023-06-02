/** @module controllers */
import { LambdaAction } from './LambdaAction';
/**
 * An interface that allows to integrate lambda services into lambda function containers
 * and connect their actions to the function calls.
 */
export interface ILambdaController {
    /**
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    getActions(): LambdaAction[];
}
