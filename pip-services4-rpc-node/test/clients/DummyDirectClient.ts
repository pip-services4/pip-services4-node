import { Descriptor } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { DirectClient } from '../../src/clients/DirectClient';
import { IDummyClient } from './IDummyClient';
import { IDummyController } from '../IDummyController';
import { Dummy } from '../Dummy';

export class DummyDirectClient extends DirectClient<IDummyController> implements IDummyClient {
            
    public constructor() {
        super();

        this._dependencyResolver.put('controller', new Descriptor("pip-services-dummies", "controller", "*", "*", "*"))
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        let timing = this.instrument(context, 'dummy.get_page_by_filter');
        try {
            return await this._controller.getPageByFilter(context, filter, paging);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.get_one_by_id');
        try {
            return await this._controller.getOneById(context, dummyId);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.create');
        try {
            return await this._controller.create(context, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.update');
        try {
            return await this._controller.update(context, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {        
        let timing = this.instrument(context, 'dummy.delete_by_id');
        try {
            return await this._controller.deleteById(context, dummyId);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async checkTraceId(context: IContext): Promise<string> {
        let timing = this.instrument(context, 'dummy.check_trace_id');
        try {
            return await this._controller.checkTraceId(context); 
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }
  
}
