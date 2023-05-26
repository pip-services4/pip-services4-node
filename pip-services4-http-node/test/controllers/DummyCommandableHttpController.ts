import { Descriptor } from 'pip-services4-components-node';

import { CommandableHttpController } from '../../src/controllers/CommandableHttpController';

export class DummyCommandableHttpController extends CommandableHttpController {
    public constructor() {
        super('dummy');
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }

    public register(): void {
        if (!this._swaggerAuto && this._swaggerEnable) {
            this.registerOpenApiSpec("swagger yaml content");
        }

        super.register();
    }
}