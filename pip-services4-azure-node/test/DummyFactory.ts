import { Descriptor, Factory } from 'pip-services4-components-node';

import { DummyService } from './DummyService';
import { DummyAzureFunctionController } from './controllers/DummyAzureFunctionController';
import { DummyCommandableAzureFunctionController } from './controllers/DummyCommandableAzureFunctionController';


export class DummyFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
	public static AzureFunctionControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "azurefunc", "*", "1.0");
	public static CmdAzureFunctionControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "commandable-azurefunc", "*", "1.0");
	public constructor() {
		super();
		this.registerAsType(DummyFactory.ControllerDescriptor, DummyService);
		this.registerAsType(DummyFactory.AzureFunctionControllerDescriptor, DummyAzureFunctionController);
		this.registerAsType(DummyFactory.CmdAzureFunctionControllerDescriptor, DummyCommandableAzureFunctionController);
	}
	
}
