import { DataPage } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams} from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-commons-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-commons-node';
import { PagingParamsSchema } from 'pip-services4-commons-node';

import { CloudFunction } from '../../src/containers/CloudFunction';
import { IDummyController } from '../IDummyController';
import { DummyFactory } from '../DummyFactory';
import { DummySchema } from '../DummySchema';
import { HttpResponseSender } from 'pip-services4-rpc-node';

export class DummyCloudFunction extends CloudFunction {
    private _controller: IDummyController;

    public constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private async getPageByFilter(req: any, res: any): Promise<void> {
        let params = req.body;
        let page = this._controller.getPageByFilter(
            params.correlation_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        );

        HttpResponseSender.sendResult(req, res, page)
    }

    private async getOneById(req: any, res: any): Promise<void> {
        let params = req.body;

        let dummy = await this._controller.getOneById(
            params.correlation_id,
            params.dummy_id
        );

        if (dummy != null) {
            HttpResponseSender.sendResult(req, res, dummy);
        } else {
            HttpResponseSender.sendEmptyResult(req, res);
        }
    }

    private async create(req: any, res: any): Promise<void> {
        let params = req.body;
        let dummy = await this._controller.create(
            params.correlation_id,
            params.dummy
        );

        HttpResponseSender.sendCreatedResult(req, res, dummy)
    }

    private async update(req: any, res: any): Promise<void> {
        let params = req.body;
        let dummy = await this._controller.update(
            params.correlation_id,
            params.dummy,
        );

        HttpResponseSender.sendResult(req, res, dummy)
    }

    private async deleteById(req: any, res: any): Promise<void> {
        let params = req.body;
        let dummy = await this._controller.deleteById(
            params.correlation_id,
            params.dummy_id,
        );

        HttpResponseSender.sendDeletedResult(req, res, dummy)
    }

    protected register() {
        this.registerAction(
            'get_dummies',
            new ObjectSchema(true)
                .withOptionalProperty('body',
                    new ObjectSchema(true)
                        .withOptionalProperty("filter", new FilterParamsSchema())
                        .withOptionalProperty("paging", new PagingParamsSchema())
                )
            , this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.getOneById);

        this.registerAction(
            'create_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.create);

        this.registerAction(
            'update_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.update);

        this.registerAction(
            'delete_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.deleteById);
    }
}