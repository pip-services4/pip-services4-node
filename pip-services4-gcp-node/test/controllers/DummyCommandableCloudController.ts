import { Descriptor } from 'pip-services4-components-node';

import { CommandableCloudFunctionController } from '../../src/controllers/CommandableCloudFunctionController';

export class DummyCommandableCloudController extends CommandableCloudFunctionController {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
