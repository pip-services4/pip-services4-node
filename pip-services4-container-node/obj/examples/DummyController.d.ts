import { IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { INotifiable } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
export declare class DummyController implements IReferenceable, IReconfigurable, IOpenable, INotifiable {
    private readonly _timer;
    private readonly _logger;
    private _message;
    private _counter;
    get message(): string;
    set message(value: string);
    get counter(): number;
    set counter(value: number);
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpen(): boolean;
    open(context: IContext): Promise<void>;
    close(context: IContext): Promise<void>;
    notify(context: IContext, args: Parameters): void;
}
