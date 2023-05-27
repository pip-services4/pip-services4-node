import { Descriptor } from 'pip-services4-commons-node';
import { CommandableHttpService } from 'pip-services4-http-node';

export class DummyCommandableHttpController extends CommandableHttpController {
    public constructor() {
        super('dummies2');
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }

    public register(): void {
        // if (!this._swaggerAuto && this._swaggerEnabled) {
        //     this.registerOpenApiSpec("swagger yaml content");
        // }

        super.register();
    }
}