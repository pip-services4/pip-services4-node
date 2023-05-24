import { IExecutable } from '../../src/run/IExecutable';
import { Parameters } from '../../src/run/Parameters';
export declare class CommandExec implements IExecutable {
    execute(correlationId: string, args: Parameters): Promise<any>;
}
