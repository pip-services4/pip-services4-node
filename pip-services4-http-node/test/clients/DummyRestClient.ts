import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { RestClient } from '../../src/clients/RestClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../sample/Dummy';

export class DummyRestClient extends RestClient implements IDummyClient {
        
    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        let params = {};
        this.addFilterParams(params, filter);
        this.addPagingParams(params, paging);

        let timing = this.instrument(context, 'dummy.get_page_by_filter');
        try {
            return await this.call('get', '/dummies', context, params);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.get_one_by_id');
        try {
            return await this.call('get', '/dummies/' + dummyId, context, {}); 
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.create');
        try {
            return await this.call('post', '/dummies', context, {}, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.update');
        try {
            return await this.call('put', '/dummies', context, {}, dummy);
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        let timing = this.instrument(context, 'dummy.delete_by_id');
        try {
            return await this.call('delete', '/dummies/' + dummyId, context, {});
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }

    public async checkTraceId(context: IContext): Promise<string> {
        let timing = this.instrument(context, 'dummy.check_trace_id');
        try {
            let result = await this.call<any>('get', '/dummies/check/trace_id', context, {});
            return result != null ? result.trace_id : null;
        } catch (ex) {
            timing.endFailure(ex);
        } finally {
            timing.endTiming();
        }
    }
  
}
