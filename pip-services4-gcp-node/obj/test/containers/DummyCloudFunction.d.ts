import { IReferences } from 'pip-services4-commons-node';
import { CloudFunction } from '../../src/containers/CloudFunction';
export declare class DummyCloudFunction extends CloudFunction {
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
