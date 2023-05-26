/** @module controllers */
/**
 * Interface to perform Swagger registrations.
 */
export interface ISwaggerController {
    /**
     * Perform required Swagger registration steps.
     */
    registerOpenApiSpec(baseRoute: string, swaggerRoute: string): void;
}
