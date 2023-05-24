import { Descriptor } from 'pip-services4-commons-node';

import { CommandableLambdaService } from '../../src/services/CommandableLambdaService';

export class DummyCommandableLambdaService extends CommandableLambdaService {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
