import { Descriptor } from 'pip-services4-commons-node';

import { CommandableCloudFunction } from '../../src/containers/CommandableCloudFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyCommandableCloudFunction extends CommandableCloudFunction {
    public constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}