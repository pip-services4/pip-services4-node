import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';

import { DummyService } from './DummyService';
import { DummyCloudController } from '../controllers/DummyCloudController';
import { DummyCommandableCloudController } from '../controllers/DummyCommandableCloudController';

export class DummyFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
	public static ServiceDescriptor = new Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
	public static CloudFunctionControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "cloudfunc", "*", "1.0");
	public static CmdCloudFunctionControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "commandable-cloudfunc", "*", "1.0");
	
	public constructor() {
		super();
		this.registerAsType(DummyFactory.ServiceDescriptor, DummyService);
		this.registerAsType(DummyFactory.CloudFunctionControllerDescriptor, DummyCloudController);
		this.registerAsType(DummyFactory.CmdCloudFunctionControllerDescriptor, DummyCommandableCloudController);
	}
	
}
