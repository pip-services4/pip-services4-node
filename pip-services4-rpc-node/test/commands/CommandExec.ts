import { IExecutable } from '../../../pip-services4-commons-node/src/run/IExecutable';
import { Parameters } from '../../../pip-services4-commons-node/src/run/Parameters';

export class CommandExec implements IExecutable {
    public async execute(context: IContext, args: Parameters): Promise<any> {
        if (context == "wrongId") {
            throw new Error("Test error");
        }

        return 0;
    }
}
