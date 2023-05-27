import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { GrpcClient } from '../../src/clients/GrpcClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../sample/Dummy';

export class DummyGrpcClient extends GrpcClient implements IDummyClient {
        
    public constructor() {
        super(__dirname + "../../../../test/protos/dummies.proto", "dummies.Dummies")
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        this.instrument(context, 'dummy.get_page_by_filter');
        return await this.call('get_dummies',
            context, 
            { 
                filter: filter,
                paging: paging
            }
        );
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        this.instrument(context, 'dummy.get_one_by_id');
        let result = await this.call<any>('get_dummy_by_id',
            context,
            {
                dummy_id: dummyId
            }
        );

        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        this.instrument(context, 'dummy.create');
        let result = await this.call<any>('create_dummy',
            context,
            {
                dummy: dummy
            }
        );

        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        this.instrument(context, 'dummy.update');
        let result = await this.call<any>('update_dummy',
            context, 
            {
                dummy: dummy
            }
        );

        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        this.instrument(context, 'dummy.delete_by_id');
        let result = await this.call<any>('delete_dummy_by_id',
            context, 
            {
                dummy_id: dummyId
            }
        );

        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }
  
}
