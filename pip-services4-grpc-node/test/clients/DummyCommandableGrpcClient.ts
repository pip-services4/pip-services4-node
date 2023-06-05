import { CommandableGrpcClient } from '../../src/clients/CommandableGrpcClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../sample/Dummy';
import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';

export class DummyCommandableGrpcClient extends CommandableGrpcClient implements IDummyClient {
        
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
  
}
