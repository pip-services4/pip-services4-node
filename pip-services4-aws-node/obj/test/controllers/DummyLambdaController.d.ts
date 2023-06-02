import { LambdaController } from '../../src/controllers/LambdaController';
import { IReferences } from 'pip-services4-components-node';
export declare class DummyLambdaController extends LambdaController {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
