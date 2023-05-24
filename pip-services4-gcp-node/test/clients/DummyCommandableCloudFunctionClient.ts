import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CommandableCloudFunctionClient } from '../../src/clients/CommandableCloudFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableCloudFunctionClient extends CommandableCloudFunctionClient implements IDummyClient {

    public constructor() { 
        super("dummies");
    }

    public async getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.callCommand('dummies.get_dummies', correlationId, {
                filter: filter,
                paging: paging
        });
    }

    public async getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        const response = await this.callCommand('dummies.get_dummy_by_id', correlationId, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }
        return response as Dummy;
    }

    public async createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand('dummies.create_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand('dummies.update_dummy', correlationId, {
                dummy: dummy
        });
    }

    public async deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.callCommand('dummies.delete_dummy', correlationId, {
                dummy_id: dummyId
        });
    }

}
