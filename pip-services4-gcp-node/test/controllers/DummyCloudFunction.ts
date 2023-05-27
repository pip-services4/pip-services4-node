import { CloudFunction } from '../../src/containers/CloudFunction';
import { DummyFactory } from '../sample/DummyFactory';

export class DummyCloudFunction extends CloudFunction {
    public constructor() {
        super("dummy", "Dummy cloud function");
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyCloudFunction().getHandler();