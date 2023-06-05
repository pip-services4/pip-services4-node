import { Parameters } from 'pip-services4-components-node';

import { Dummy } from './Dummy';
import { IDummyService } from './IDummyService';
import { DummySchema } from './DummySchema';
import { TypeCode } from 'pip-services4-commons-node';
import { IContext } from 'pip-services4-components-node';
import { ObjectSchema, FilterParamsSchema, PagingParamsSchema, DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { CommandSet, ICommand, Command } from 'pip-services4-rpc-node';

export class DummyCommandSet extends CommandSet {
    private _controller: IDummyService;

	constructor(controller: IDummyService) {
		super();

		this._controller = controller;

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
				return this._controller.getPageByFilter(context, filter, paging);
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
				return this._controller.getOneById(context, id);
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
				return this._controller.create(context, entity);
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
				return this._controller.update(context, entity);
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
				return this._controller.deleteById(context, id);
			}
		);
	}

}