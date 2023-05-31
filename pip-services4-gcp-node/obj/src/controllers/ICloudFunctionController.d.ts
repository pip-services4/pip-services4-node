/** @module controllers */
import { CloudFunctionAction } from './CloudFunctionAction';
/**
 * An interface that allows to integrate Google Function controllers into Google Function containers
 * and connect their actions to the function calls.
 */
export interface ICloudFunctionController {
    /**
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    getActions(): CloudFunctionAction[];
}
