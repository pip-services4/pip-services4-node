
import { Descriptor } from 'pip-services4-components-node';
import { CommandableLambdaController } from '../../src/controllers/CommandableLambdaController';

export class DummyCommandableLambdaController extends CommandableLambdaController {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
