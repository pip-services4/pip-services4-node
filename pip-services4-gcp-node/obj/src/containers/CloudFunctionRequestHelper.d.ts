/** @module containers */
import { Parameters } from 'pip-services4-commons-node';
/**
 * Class that helps to prepare function requests
 */
export declare class CloudFunctionRequestHelper {
    /**
     * Returns correlationId from Google Function request.
     * @param req the Google Function request
     * @return returns correlationId from request
     */
    static getCorrelationId(req: any): string;
    /**
     * Returns command from Google Function request.
     * @param req the Google Function request
     * @return returns command from request
     */
    static getCommand(req: any): string;
    /**
     * Returns body from Google Function request http request.
     * @param req the Google Function request
     * @return returns body from request
     */
    static getParameters(req: any): Parameters;
}
