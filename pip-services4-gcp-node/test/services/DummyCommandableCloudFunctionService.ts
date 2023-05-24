import { Descriptor } from 'pip-services4-commons-node';

import { CommandableCloudFunctionService } from '../../src/services/CommandableCloudFunctionService';

export class DummyCommandableCloudFunctionService extends CommandableCloudFunctionService {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
