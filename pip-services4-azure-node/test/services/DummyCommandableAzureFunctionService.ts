import { Descriptor } from 'pip-services4-commons-node';

import { CommandableAzureFunctionService } from '../../src/services/CommandableAzureFunctionService';

export class DummyCommandableAzureFunctionService extends CommandableAzureFunctionService {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
