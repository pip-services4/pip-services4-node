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

    public async getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        const response = await this.call<DataPage<Dummy>>('dummies.get_dummies', correlationId, {
            filter: filter,
            paging: paging
        });

        return response;
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }

        return response;
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.create_dummy', correlationId, {
                dummy: dummy
        });

        return response;
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.update_dummy', correlationId, {
                dummy: dummy
        });

        return response;
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.call<Dummy>('dummies.delete_dummy', correlationId, {
                dummy_id: dummyId
        });

        return response;
    }

}
