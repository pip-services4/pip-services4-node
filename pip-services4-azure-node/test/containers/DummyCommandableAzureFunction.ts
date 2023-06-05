
import { Descriptor } from 'pip-services4-components-node';
import { CommandableAzureFunction } from '../../src/containers/CommandableAzureFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyCommandableAzureFunction extends CommandableAzureFunction {
    public constructor() {
        super("dummy", "Dummy Azure function");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}