import { Descriptor } from 'pip-services4-components-node';

import { CommandableCloudFunction } from '../../src/containers/CommandableCloudFunction';
import { DummyFactory } from '../sample/DummyFactory';

export class DummyCommandableCloudFunction extends CommandableCloudFunction {
    public constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}