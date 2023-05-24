import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CommandableGrpcClient } from '../../src/clients/CommandableGrpcClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../Dummy';

export class DummyCommandableGrpcClient extends CommandableGrpcClient implements IDummyClient {
        
    public constructor() {
        super('dummy');
    }

    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return this.callCommand(
            'get_dummies', 
            correlationId, 
            {
                filter: filter,
                paging: paging
            }
        );
    }

    public getDummyById(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.callCommand(
            'get_dummy_by_id', 
            correlationId,
            {
                dummy_id: dummyId
            }
        );        
    }

    public createDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand(
            'create_dummy',
            correlationId,
            {
                dummy: dummy
            }
        );
    }

    public updateDummy(correlationId: string, dummy: any): Promise<Dummy> {
        return this.callCommand(
            'update_dummy',
            correlationId,
            {
                dummy: dummy
            }
        );
    }

    public deleteDummy(correlationId: string, dummyId: string): Promise<Dummy> {
        return this.callCommand(
            'delete_dummy',
            correlationId, 
            {
                dummy_id: dummyId
            }
        );
    }
  
}
