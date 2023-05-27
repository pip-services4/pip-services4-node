import { Descriptor } from 'pip-services4-components-node';

import { CommandableGrpcController } from '../../src/controllers/CommandableGrpcController';

export class DummyCommandableGrpcController extends CommandableGrpcController {
    public constructor() {
        super('dummy');
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}