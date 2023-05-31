import { TypeCode } from 'pip-services4-commons-node';
import { IContext } from 'pip-services4-components-node';
import { ObjectSchema, FilterParamsSchema, PagingParamsSchema, FilterParams, PagingParams } from 'pip-services4-data-node';
import { Parameters } from 'pip-services4-components-node';
import { CommandSet, ICommand, Command } from 'pip-services4-rpc-node';

import { Dummy } from '../data/Dummy';
import { IDummyService } from './IDummyService';
import { DummySchema } from '../data/DummySchema';

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
			async (context: IContext, args: Parameters) => {
				const filter = FilterParams.fromValue(args.get("filter"));
				const paging = PagingParams.fromValue(args.get("paging"));
				return await this._controller.getPageByFilter(context, filter, paging);
			}
		);
	}

	private makeGetOneByIdCommand(): ICommand {
		return new Command(
			"get_dummy_by_id",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			async (context: IContext, args: Parameters) => {
				const id = args.getAsString("dummy_id");
				return await this._controller.getOneById(context, id);
			}
		);
	}

	private makeCreateCommand(): ICommand {
		return new Command(
			"create_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			async (context: IContext, args: Parameters) => {
				const entity: Dummy = args.get("dummy");
				return await this._controller.create(context, entity);
			}
		);
	}

	private makeUpdateCommand(): ICommand {
		return new Command(
			"update_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			async (context: IContext, args: Parameters) => {
				const entity: Dummy = args.get("dummy");
				return await this._controller.update(context, entity);
			}
		);
	}

	private makeDeleteByIdCommand(): ICommand {
		return new Command(
			"delete_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			async (context: IContext, args: Parameters) => {
				const id = args.getAsString("dummy_id");
				return await this._controller.deleteById(context, id);
			}
		);
	}

}