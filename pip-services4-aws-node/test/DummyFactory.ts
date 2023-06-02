import { Descriptor, Factory } from 'pip-services4-components-node';

import { DummyService } from './DummyService';
import { DummyLambdaController } from './controllers/DummyLambdaController';
import { DummyCommandableLambdaController } from './controllers/DummyCommandableLambdaController';

export class DummyFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
	public static LambdaControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "awslambda", "*", "1.0");
	public static CmdLambdaControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "commandable-awslambda", "*", "1.0");
	
	public constructor() {
		super();
		this.registerAsType(DummyFactory.ControllerDescriptor, DummyService);
		this.registerAsType(DummyFactory.LambdaControllerDescriptor, DummyLambdaController);
		this.registerAsType(DummyFactory.CmdLambdaControllerDescriptor, DummyCommandableLambdaController);
	}
	
}
