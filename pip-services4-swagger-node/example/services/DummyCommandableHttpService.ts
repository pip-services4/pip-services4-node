import { Descriptor } from 'pip-services4-commons-node';
import { CommandableHttpService } from 'pip-services4-rpc-node';

export class DummyCommandableHttpService extends CommandableHttpService {
    public constructor() {
        super('dummies2');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }

    public register(): void {
        // if (!this._swaggerAuto && this._swaggerEnabled) {
        //     this.registerOpenApiSpec("swagger yaml content");
        // }

        super.register();
    }
}