import { Descriptor } from 'pip-services4-commons-node';
import { CommandableGrpcService } from '../../src/services/CommandableGrpcService';

export class DummyCommandableGrpcService extends CommandableGrpcService {
    public constructor() {
        super('dummy');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}