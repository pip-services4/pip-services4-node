import { IReferences } from 'pip-services4-components-node';
import { CloudFunction } from '../../src/containers/CloudFunction';
export declare class DummyCloudFunction extends CloudFunction {
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
