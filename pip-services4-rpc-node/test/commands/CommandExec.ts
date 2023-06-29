import { IExecutable, IContext, ContextResolver } from "pip-services4-components-node";
import { Parameters } from 'pip-services4-components-node';

export class CommandExec implements IExecutable {
    public async execute(context: IContext, args: Parameters): Promise<any> {
        if (context != null && ContextResolver.getTraceId(context) == "wrongId") {
            throw new Error("Test error");
        }

        return 0;
    }
}
