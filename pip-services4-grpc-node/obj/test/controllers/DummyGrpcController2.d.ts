import { IReferences } from 'pip-services4-components-node';
import { GrpcController } from '../../src/controllers/GrpcController';
export declare class DummyGrpcController2 extends GrpcController {
    private _service;
    private _numberOfCalls;
    constructor();
    setReferences(references: IReferences): void;
    getNumberOfCalls(): number;
    private incrementNumberOfCalls;
    private dummyToObject;
    private dummyPageToObject;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    register(): void;
}
