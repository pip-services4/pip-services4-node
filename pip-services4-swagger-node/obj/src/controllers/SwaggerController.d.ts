import { ISwaggerController, RestController } from 'pip-services4-http-node';
export declare class SwaggerController extends RestController implements ISwaggerController {
    private _routes;
    constructor();
    private calculateFilePath;
    private calculateContentType;
    private checkFileExist;
    private loadFileContent;
    private getSwaggerFile;
    private getIndex;
    private redirectToIndex;
    private composeSwaggerRoute;
    registerOpenApiSpec(baseRoute: string, swaggerRoute?: string): void;
    register(): void;
}
