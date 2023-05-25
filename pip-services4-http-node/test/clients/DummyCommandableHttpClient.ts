import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CommandableHttpClient } from '../../src/clients/CommandableHttpClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableHttpClient extends CommandableHttpClient implements IDummyClient {

    public constructor() {
        super('dummy');
    }


    public getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.callCommand(
            'get_dummies',
            context,
            {
                filter: filter,
                paging: paging
            }
        );
    }

    public getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        return this.callCommand(
            'get_dummy_by_id',
            context,
            {
                dummy_id: dummyId
            }
        );
    }

    public createDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.callCommand(
            'create_dummy',
            context,
            {
                dummy: dummy
            }
        );
    }

    public updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        return this.callCommand(
            'update_dummy',
            context,
            {
                dummy: dummy
            }
        );
    }

    public deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        return this.callCommand(
            'delete_dummy',
            context,
            {
                dummy_id: dummyId
            }
        );
    }

    public async checkTraceId(context: IContext): Promise<string> {
        let result = await this.callCommand<any>(
            'check_trace_id',
            context,
            null
        );
        return result != null ? result.trace_id : null;
    }

}
