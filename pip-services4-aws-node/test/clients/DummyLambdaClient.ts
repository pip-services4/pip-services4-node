import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { LambdaClient } from '../../src/clients/LambdaClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyLambdaClient extends LambdaClient implements IDummyClient {

    public constructor() { 
        super();
    }

    public async getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.call('get_dummies', correlationId, {
            filter: filter,
            paging: paging
        });
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.call('get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.call('create_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.call('update_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.call('delete_dummy', correlationId, {
                dummy_id: dummyId
        });
    }

}
