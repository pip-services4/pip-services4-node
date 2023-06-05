
import { Descriptor } from 'pip-services4-components-node';
import { CommandableAzureFunctionController } from '../../src/controllers/CommandableAzureFunctionController';

export class DummyCommandableAzureFunctionController extends CommandableAzureFunctionController {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
