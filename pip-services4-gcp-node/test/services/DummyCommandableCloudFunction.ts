import { CommandableCloudFunction } from '../../src/containers/CommandableCloudFunction';
import { DummyFactory } from '../DummyFactory';
import { Descriptor } from "pip-services4-commons-node";

export class DummyCommandableCloudFunction extends CommandableCloudFunction {
    public constructor() {
        super("dummy", "Dummy commandable cloud function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}

export const commandableHandler = new DummyCommandableCloudFunction().getHandler();