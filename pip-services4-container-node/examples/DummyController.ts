import { IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { INotifiable } from 'pip-services4-components-node';
import { FixedRateTimer } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';

export class DummyController implements IReferenceable, IReconfigurable, IOpenable, INotifiable {
    private readonly _timer = new FixedRateTimer(this, 1000, 1000);
    private readonly _logger: CompositeLogger = new CompositeLogger();
    private _message = "Hello World!";
    private _counter = 0;

    public get message(): string { 
        return this._message; 
    }
    public set message(value: string) { 
        this._message = value; 
    }

    public get counter(): number { 
        return this._counter; 
    }
    public set counter(value: number) { 
        this._counter = value; 
    }

    public configure(config: ConfigParams): void {
        this.message = config.getAsStringWithDefault("message", this.message);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
    }

    public isOpen(): boolean {
        return this._timer.isStarted();
    }

    public async open(context: IContext): Promise<void> {
        this._timer.start();
        this._logger.trace(context, "Dummy controller opened");
    }
        
    public async close(context: IContext): Promise<void> {
        this._timer.stop();
        this._logger.trace(context, "Dummy controller closed");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public notify(context: IContext, args: Parameters): void {
        this._logger.info(context, "%d - %s", this.counter++, this.message);
    }

}
