import { IExecutable, IContext } from "pip-services4-components-node";
import { Parameters } from 'pip-services4-components-node';
export declare class CommandExec implements IExecutable {
    execute(context: IContext, args: Parameters): Promise<any>;
}
