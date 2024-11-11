import { IReferences } from 'pip-services4-components-node';
import { LambdaSingleFunction } from '../../src/containers/LambdaSingleFunction';
export declare class CreateDummyLambdaFunction extends LambdaSingleFunction {
    private _service;
    constructor();
    setReferences(references: IReferences): void;
    private create;
    protected register(): void;
}
export declare const createDummyHandler: (event: any) => Promise<any>;
