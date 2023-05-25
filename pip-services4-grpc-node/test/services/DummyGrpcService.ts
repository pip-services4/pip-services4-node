import { IReferences } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { PagingParamsSchema } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-commons-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-commons-node';

import { DummySchema } from '../DummySchema';
import { GrpcService } from '../../src/services/GrpcService';
import { IDummyController } from '../IDummyController';

export class DummyGrpcService extends GrpcService {
    private _controller: IDummyController;
    private _numberOfCalls: number = 0;
	
    public constructor() {
        super(__dirname + "../../../../test/protos/dummies.proto", "dummies.Dummies.service");
        this._dependencyResolver.put('controller', new Descriptor("pip-services-dummies", "controller", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }
    
    public getNumberOfCalls(): number {
        return this._numberOfCalls;
    }

    private incrementNumberOfCalls(call: any, next: (call: any) => Promise<any>): Promise<any> {
        this._numberOfCalls++;
        return next(call);
    }

    private async getPageByFilter(call: any): Promise<any> {
        let filter = FilterParams.fromValue(call.request.filter);
        let paging = PagingParams.fromValue(call.request.paging);

        return await this._controller.getPageByFilter(
            call.request.trace_id,
            filter,
            paging
        );
    }

    private async getOneById(call: any): Promise<any> {
        let result = await this._controller.getOneById(
            call.request.trace_id,
            call.request.dummy_id
        );
        return result || {};
    }

    private async create(call: any): Promise<any> {
        return await this._controller.create(
            call.request.trace_id,
            call.request.dummy,
        );
    }

    private async update(call: any): Promise<any> {
        return await this._controller.update(
            call.request.trace_id,
            call.request.dummy
        );
    }

    private async deleteById(call: any): Promise<any> {
        let result = await this._controller.deleteById(
            call.request.trace_id,
            call.request.dummy_id,
        );
        return result || {};
    }    
        
    public register() {
        this.registerInterceptor(this.incrementNumberOfCalls);

        this.registerMethod(
            'get_dummies', 
            new ObjectSchema(true)
                .withOptionalProperty("paging", new PagingParamsSchema())
                .withOptionalProperty("filter", new FilterParamsSchema()),
            this.getPageByFilter
        );

        this.registerMethod(
            'get_dummy_by_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.getOneById
        );

        this.registerMethod(
            'create_dummy', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            this.create
        );

        this.registerMethod(
            'update_dummy', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            this.update
        );

        this.registerMethod(
            'delete_dummy_by_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.deleteById
        );
    }
}
