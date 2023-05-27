let _ = require('lodash');
let services = require('../../../test/protos/dummies_grpc_pb');
let messages = require('../../../test/protos/dummies_pb');

import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { GrpcClient } from '../../src/clients/GrpcClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../sample/Dummy';

export class DummyGrpcClient2 extends GrpcClient implements IDummyClient {
        
    public constructor() {
        super(services.DummiesClient)
    }

    public async getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        paging = paging || new PagingParams();
        let pagingParams = new messages.PagingParams();
        pagingParams.setSkip(paging.skip);
        pagingParams.setTake(paging.take);
        pagingParams.setTotal(paging.total);

        let request = new messages.DummiesPageRequest();
        request.setPaging(pagingParams);

        filter = filter || new FilterParams();
        let filterParams = request.getFilterMap();
        for (let propName in filter) {
            if (filter.hasOwnProperty(propName)) {
                filterParams[propName] = filter[propName];
            }
        }

        this.instrument(context, 'dummy.get_page_by_filter');

        let result = await this.call<any>('get_dummies',
            context, 
            request
        );

        result = result != null ? result.toObject() : null;
        if (result) {
            result.data = result.dataList;
            delete result.dataList;
        }

        return result;
    }

    public async getDummyById(context: IContext, dummyId: string): Promise<Dummy> {
        let request = new messages.DummyIdRequest();
        request.setDummyId(dummyId);

        this.instrument(context, 'dummy.get_one_by_id');

        let result = await this.call<any>('get_dummy_by_id',
            context,
            request
        );

        result = result != null ? result.toObject() : null;
        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async createDummy(context: IContext, dummy: any): Promise<Dummy> {
        let dummyObj = new messages.Dummy();
        dummyObj.setId(dummy.id);
        dummyObj.setKey(dummy.key);
        dummyObj.setContent(dummy.content);

        let request = new messages.DummyObjectRequest();
        request.setDummy(dummyObj);

        this.instrument(context, 'dummy.create');

        let result = await this.call<any>('create_dummy',
            context,
            request
        );

        result = result != null ? result.toObject() : null;
        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async updateDummy(context: IContext, dummy: any): Promise<Dummy> {
        let dummyObj = new messages.Dummy();
        dummyObj.setId(dummy.id);
        dummyObj.setKey(dummy.key);
        dummyObj.setContent(dummy.content);

        let request = new messages.DummyObjectRequest();
        request.setDummy(dummyObj);
    
        this.instrument(context, 'dummy.update');

        let result = await this.call<any>('update_dummy',
            context, 
            request
        );

        result = result != null ? result.toObject() : null;
        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }

    public async deleteDummy(context: IContext, dummyId: string): Promise<Dummy> {
        let request = new messages.DummyIdRequest();
        request.setDummyId(dummyId);

        this.instrument(context, 'dummy.delete_by_id');

        let result = await this.call<any>('delete_dummy_by_id',
            context, 
            request
        );

        result = result != null ? result.toObject() : null;
        if (result && result.id == "" && result.key == "") {
            result = null;
        }

        return result;
    }
  
}
