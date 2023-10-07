import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { CommandableCloudFunctionClient } from '../../src/clients/CommandableCloudFunctionClient';
import { IDummyClient } from '../sample/IDummyClient';
import { Dummy } from '../sample/Dummy';

export class DummyCommandableCloudClient extends CommandableCloudFunctionClient implements IDummyClient {

    public constructor() { 
        super("dummies");
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.callCommand('get_dummies', context, {
                filter: filter,
                paging: paging
        });
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        const response = await this.callCommand('get_dummy_by_id', context, {
                dummy_id: dummyId
        });

        if (response == null || Object.keys(response).length === 0) {
            return null;
        }
        return response as Dummy;
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.callCommand('create_dummy', context, {
                dummy: dummy
        });
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.callCommand('update_dummy', context, {
                dummy: dummy
        });
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        return this.callCommand('delete_dummy', context, {
                dummy_id: dummyId
        });
    }

}
