import { ConfigParams, IContext, IReferenceable, IReferences } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { Dummy } from './Dummy';
import { IDummyService } from './IDummyService';
export declare class DummySingleService implements IDummyService, IReferenceable {
    private _persistence;
    private static _defaultConfig;
    private _dependencyResolver;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, dummyId: string): Promise<Dummy>;
    create(context: IContext, dummy: Dummy): Promise<Dummy>;
    update(context: IContext, dummy: Dummy): Promise<Dummy>;
    deleteById(context: IContext, dummyId: string): Promise<Dummy>;
}
