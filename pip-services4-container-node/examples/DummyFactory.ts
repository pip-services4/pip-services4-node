import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { DummyController } from './DummyController';

export class DummyFactory extends Factory {
	private static ControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "default", "*", "1.0");
	
	public constructor() {
		super();
		this.registerAsType(DummyFactory.ControllerDescriptor, DummyController);
	}
	
}

