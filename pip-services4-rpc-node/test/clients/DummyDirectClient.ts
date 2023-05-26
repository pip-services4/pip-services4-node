import { IContext } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { IDummyService } from '../sample/IDummyService';
import { Dummy } from '../sample/Dummy';
import { DirectClient } from '../../src/clients/DirectClient';
import { IDummyClient } from './IDummyClient';

export class DummyDirectClient extends DirectClient<IDummyService> implements IDummyClient {
            
    public constructor() {
        super();

        this._dependencyResolver.put('service', new Descriptor("pip-services-dummies", "service", "*", "*", "*"))
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        let timing = this.instrument(context, 'dummy.get_page_by_filter');
        try {
            return await this._service.getPageByFilter(context, filter, paging);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.get_one_by_id');
        try {
            return await this._service.getOneById(context, dummyId);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.create');
        try {
            return await this._service.create(context, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.update');
        try {
            return await this._service.update(context, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.delete_by_id');
        try {
            return await this._service.deleteById(context, dummyId);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async checkTraceId(context: IContext): Promise<string> {
        let timing = this.instrument(context, 'dummy.check_trace_id');
        try {
            return await this._service.checkTraceId(context); 
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }
  
}
