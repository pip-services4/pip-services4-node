import { LambdaSingleFunction } from '../../src/containers/LambdaSingleFunction';
import { IReferences } from 'pip-services4-components-node';
export declare class GetDummiesLambdaFunction extends LambdaSingleFunction {
    private _service;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    protected register(): void;
}
export declare const getDummiesHandler: (event: any) => Promise<any>;
