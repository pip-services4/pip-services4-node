import { Descriptor } from 'pip-services4-commons-node';

import { CommandableLambdaFunction } from '../../src/containers/CommandableLambdaFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyCommandableLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyCommandableLambdaFunction().getHandler();