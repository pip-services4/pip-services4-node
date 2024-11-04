import { Descriptor, Factory } from 'pip-services4-components-node';
export declare class DummyFactory extends Factory {
    static Descriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static DummySingleServiceDescriptor: Descriptor;
    static LambdaControllerDescriptor: Descriptor;
    static CmdLambdaControllerDescriptor: Descriptor;
    constructor();
}
