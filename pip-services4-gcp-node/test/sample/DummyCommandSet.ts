import { IContext } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { CommandSet } from 'pip-services4-rpc-node';
import { ICommand } from 'pip-services4-rpc-node';
import { Command } from 'pip-services4-rpc-node';
import { Parameters } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { ObjectSchema } from 'pip-services4-data-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-data-node';
import { PagingParamsSchema } from 'pip-services4-data-node';

import { Dummy } from './Dummy';
import { IDummyService } from './IDummyService';
import { DummySchema } from './DummySchema';

export class DummyCommandSet extends CommandSet {
    private _service: IDummyService;

	constructor(service: IDummyService) {
		super();

		this._service = service;

		this.addCommand(this.makeGetPageByFilterCommand());
		this.addCommand(this.makeGetOneByIdCommand());
		this.addCommand(this.makeCreateCommand());
		this.addCommand(this.makeUpdateCommand());
		this.addCommand(this.makeDeleteByIdCommand());
	}

	private makeGetPageByFilterCommand(): ICommand {
		return new Command(
			"get_dummies",
			new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
			(context: IContext, args: Parameters): Promise<DataPage<Dummy>> => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				return this._service.getPageByFilter(context, filter, paging);
			}
		);
	}

	private makeGetOneByIdCommand(): ICommand {
		return new Command(
			"get_dummy_by_id",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			(context: IContext, args: Parameters): Promise<Dummy> => {
				let id = args.getAsString("dummy_id");
				return this._service.getOneById(context, id);
			}
		);
	}

	private makeCreateCommand(): ICommand {
		return new Command(
			"create_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			(context: IContext, args: Parameters): Promise<Dummy> => {
				let entity: Dummy = args.get("dummy");
				return this._service.create(context, entity);
			}
		);
	}

	private makeUpdateCommand(): ICommand {
		return new Command(
			"update_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			(context: IContext, args: Parameters): Promise<Dummy> => {
				let entity: Dummy = args.get("dummy");
				return this._service.update(context, entity);
			}
		);
	}

	private makeDeleteByIdCommand(): ICommand {
		return new Command(
			"delete_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			(context: IContext, args: Parameters): Promise<Dummy> => {
				let id = args.getAsString("dummy_id");
				return this._service.deleteById(context, id);
			}
		);
	}

}