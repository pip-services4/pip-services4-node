import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { AzureFunctionClient } from '../../src/clients/AzureFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export interface DummyAzureFunctionClientResponse {
    body?: any
}

export class DummyAzureFunctionClient extends AzureFunctionClient implements IDummyClient {

    public constructor() { 
        super();
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        const response = await this.call<DummyAzureFunctionClientResponse>('get_dummies', context, {
            filter: filter,
            paging: paging
        });

        return response as DataPage<Dummy>;
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('get_dummy_by_id', context, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }

        return response as Dummy;
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('create_dummy', context, {
                dummy: dummy
        });

        return response as Dummy;
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('update_dummy', context, {
                dummy: dummy
        });

        return response as Dummy;
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        const response = await this.call<DummyAzureFunctionClientResponse>('delete_dummy', context, {
                dummy_id: dummyId
        });

        return response as Dummy;
    }

}
