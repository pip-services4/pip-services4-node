import { CommandableAzureFunction } from '../../src/containers/CommandableAzureFunction';
import { DummyFactory } from '../DummyFactory';
import { Descriptor } from "pip-services4-commons-node";

export class DummyCommandableAzureFunction extends CommandableAzureFunction {
    public constructor() {
        super("dummy", "Dummy commandable Azure function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyCommandableAzureFunction().getHandler();