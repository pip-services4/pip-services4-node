

import { ConfigParams, DependencyResolver, Descriptor, IContext, IReferenceable, IReferences } from 'pip-services4-components-node';
import { DataPage, FilterParams, IdGenerator, PagingParams } from 'pip-services4-data-node';
import { Dummy } from './Dummy';
import { IDummyPersistence } from './IDummyPersistence';
import { IDummyService } from './IDummyService';

export class DummySingleService implements IDummyService, IReferenceable {
	private _persistence: IDummyPersistence;
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-dummies:persistence:*:*:1.0'
    );
    private _dependencyResolver: DependencyResolver = new DependencyResolver(DummySingleService._defaultConfig);

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IDummyPersistence>(
            new Descriptor('pip-services-dummies', 'persistence', '*', '*', '1.0')
        );
    }

    public getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this._persistence.getPageByFilter(context, filter, paging);
    }

    public getOneById(context: IContext, dummyId: string): Promise<Dummy> {
        return this._persistence.getOneById(context, dummyId);
    }

    public create(context: IContext, dummy: Dummy): Promise<Dummy> {
        dummy.id = dummy.id || IdGenerator.nextLong();

        return this._persistence.create(context, dummy);
    }

    public update(context: IContext, dummy: Dummy): Promise<Dummy> {
        return this._persistence.update(context, dummy);
    }

    public deleteById(context: IContext, dummyId: string): Promise<Dummy> {
        return this._persistence.deleteById(context, dummyId);
    }

}