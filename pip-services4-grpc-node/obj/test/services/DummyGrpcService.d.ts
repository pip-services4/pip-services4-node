import { IReferences } from 'pip-services4-commons-node';
import { GrpcService } from '../../src/services/GrpcService';
export declare class DummyGrpcService extends GrpcService {
    private _controller;
    private _numberOfCalls;
    constructor();
    setReferences(references: IReferences): void;
    getNumberOfCalls(): number;
    private incrementNumberOfCalls;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    register(): void;
}
