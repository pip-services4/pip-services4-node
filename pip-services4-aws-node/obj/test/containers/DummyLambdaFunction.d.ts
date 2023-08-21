import { LambdaFunction } from '../../src/containers/LambdaFunction';
import { IReferences } from 'pip-services4-components-node';
export declare class DummyLambdaFunction extends LambdaFunction {
    private _service;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
export declare const handler: (event: any) => Promise<any>;
