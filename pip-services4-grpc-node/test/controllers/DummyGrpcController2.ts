const services = require('../../../test/protos/dummies_grpc_pb');
const messages = require('../../../test/protos/dummies_pb');

import { IReferences } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';

import { Dummy } from '../sample/Dummy';
import { GrpcController } from '../../src/controllers/GrpcController';
import { IDummyService } from '../sample/IDummyService';

export class DummyGrpcController2 extends GrpcController {
    private _service: IDummyService;
    private _numberOfCalls: number = 0;
	
    public constructor() {
        super(services.DummiesService);
        this._dependencyResolver.put('controller', new Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }
    
    public getNumberOfCalls(): number {
        return this._numberOfCalls;
    }

    private incrementNumberOfCalls(call: any, next: (call: any) => Promise<any>): Promise<any> {
        this._numberOfCalls++;
        return next(call);
    }

    private dummyToObject(dummy: Dummy): any {
        let obj = new messages.Dummy();

        if (dummy) {
            obj.setId(dummy.id);
            obj.setKey(dummy.key);
            obj.setContent(dummy.content);
        }

        return obj;
    }

    private dummyPageToObject(page: DataPage<Dummy>): any {
        let obj = new messages.DummiesPage();

        if (page) {
            obj.setTotal(page.total);
            let data = page.data.map(this.dummyToObject);
            obj.setDataList(data);
        }

        return obj;
    }

    private async getPageByFilter(call: any): Promise<any> {
        let request = call.request.toObject();
        let filter = FilterParams.fromValue(request.filterMap);
        let paging = PagingParams.fromValue(call.request.paging);

        let page = await this._service.getPageByFilter(
            call.request.trace_id,
            filter,
            paging
        );

        return this.dummyPageToObject(page);
    }

    private async getOneById(call: any): Promise<any> {
        let request = call.request.toObject();

        let result = await this._service.getOneById(
            request.trace_id,
            request.dummy_id
        );

        return this.dummyToObject(result);
    }

    private async create(call: any): Promise<any> {
        let request = call.request.toObject();

        let result = await this._service.create(
            request.trace_id,
            request.dummy
        );

        return this.dummyToObject(result);
    }

    private async update(call: any): Promise<any> {
        let request = call.request.toObject();

        let result = await this._service.update(
            request.trace_id,
            request.dummy
        );

        return this.dummyToObject(result);
    }

    private async deleteById(call: any): Promise<any> {
        let request = call.request.toObject();

        let result = await this._service.deleteById(
            request.trace_id,
            request.dummy_id
        );

        return this.dummyToObject(result);
    }    
        
    public register() {
        this.registerInterceptor(this.incrementNumberOfCalls);

        this.registerMethod(
            'get_dummies', 
            null,
            // new ObjectSchema(true)
            //     .withOptionalProperty("paging", new PagingParamsSchema())
            //     .withOptionalProperty("filter", new FilterParamsSchema()),
            this.getPageByFilter
        );

        this.registerMethod(
            'get_dummy_by_id', 
            null,
            // new ObjectSchema(true)
            //     .withRequiredProperty("dummy_id", TypeCode.String),
            this.getOneById
        );

        this.registerMethod(
            'create_dummy', 
            null,
            // new ObjectSchema(true)
            //     .withRequiredProperty("dummy", new DummySchema()),
            this.create
        );

        this.registerMethod(
            'update_dummy', 
            null,
            // new ObjectSchema(true)
            //     .withRequiredProperty("dummy", new DummySchema()),
            this.update
        );

        this.registerMethod(
            'delete_dummy_by_id',
            null, 
            // new ObjectSchema(true)
            //     .withRequiredProperty("dummy_id", TypeCode.String),
            this.deleteById
        );
    }
}
