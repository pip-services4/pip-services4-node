
import { Descriptor } from 'pip-services4-components-node';
import { CommandableLambdaFunction } from '../../src/containers/CommandableLambdaFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyCommandableLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyCommandableLambdaFunction().getHandler();