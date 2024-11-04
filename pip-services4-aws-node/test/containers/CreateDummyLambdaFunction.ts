

import { Descriptor, IReferences } from 'pip-services4-components-node';
import { ObjectSchema } from 'pip-services4-data-node';
import { LambdaSingleFunction } from '../../src/containers/LambdaSingleFunction';
import { Dummy } from "../Dummy";
import { DummyFactory } from '../DummyFactory';
import { DummySchema } from '../DummySchema';
import { IDummyService } from '../IDummyService';

export class CreateDummyLambdaFunction extends LambdaSingleFunction {
    private _service: IDummyService;

    public constructor() {
        super("create_dummy", "Create Dummy lambda single function");
        this._dependencyResolver.put('single-service', new Descriptor('pip-services-dummies', 'service', 'single-service', '*', '*'));
        this._factories.add(new DummyFactory());
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('single-service');
    }
    
    private async create(params: any): Promise<Dummy> {
        return this._service.create(
            params.trace_id,
            params.dummy
        );
    }

    protected register() {
        this.registerSingleAction(
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema())
            , this.create);
    }
}

export const createDummyHandler = new CreateDummyLambdaFunction().getHandler();