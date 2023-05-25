import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CloudFunctionClient } from '../../src/clients/CloudFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCloudFunctionClient extends CloudFunctionClient implements IDummyClient {

    public constructor() { 
        super();
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        const response = await this.call<DataPage<Dummy>>('dummies.get_dummies', context, {
            filter: filter,
            paging: paging
        });

        return response;
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.get_dummy_by_id', context, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }

        return response;
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.create_dummy', context, {
                dummy: dummy
        });

        return response;
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.update_dummy', context, {
                dummy: dummy
        });

        return response;
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.delete_dummy', context, {
                dummy_id: dummyId
        });

        return response;
    }

}
