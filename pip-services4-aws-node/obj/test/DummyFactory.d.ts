import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';
export declare class DummyFactory extends Factory {
    static Descriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static LambdaServiceDescriptor: Descriptor;
    static CmdLambdaServiceDescriptor: Descriptor;
    constructor();
}
