import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CommandableLambdaClient } from '../../src/clients/CommandableLambdaClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableLambdaClient extends CommandableLambdaClient implements IDummyClient {

    public constructor() { 
        super("dummy");
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.call('get_dummies', context, {
                filter: filter,
                paging: paging
        });
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        return this.call('get_dummy_by_id', context, {
                dummy_id: dummyId
        });
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.call('create_dummy', context, {
                dummy: dummy
        });
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.call('update_dummy', context, {
                dummy: dummy
        });
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        return this.call('delete_dummy', context, {
                dummy_id: dummyId
        });
    }

}
