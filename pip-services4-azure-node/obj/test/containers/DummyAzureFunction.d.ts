import { IReferences } from 'pip-services4-commons-node';
import { AzureFunction } from '../../src/containers/AzureFunction';
export declare class DummyAzureFunction extends AzureFunction {
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
