import { IExecutable } from '../../src/run/IExecutable';
import { Parameters } from '../../src/run/Parameters';

export class CommandExec implements IExecutable {
    public async execute(correlationId: string, args: Parameters): Promise<any> {
        if (correlationId == "wrongId") {
            throw new Error("Test error");
        }

        return 0;
    }
}
