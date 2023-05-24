import { CommandSet } from 'pip-services4-commons-node';
import { ICommand } from 'pip-services4-commons-node';
import { Command } from 'pip-services4-commons-node';
import { Parameters } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-commons-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-commons-node';
import { PagingParamsSchema } from 'pip-services4-commons-node';

import { Dummy } from '../data/Dummy';
import { IDummyController } from './IDummyController';
import { DummySchema } from '../data/DummySchema';

export class DummyCommandSet extends CommandSet {
    private _controller: IDummyController;

	constructor(controller: IDummyController) {
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
			async (correlationId: string, args: Parameters) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				return await this._controller.getPageByFilter(correlationId, filter, paging);
			}
		);
	}

	private makeGetOneByIdCommand(): ICommand {
		return new Command(
			"get_dummy_by_id",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			async (correlationId: string, args: Parameters) => {
				let id = args.getAsString("dummy_id");
				return await this._controller.getOneById(correlationId, id);
			}
		);
	}

	private makeCreateCommand(): ICommand {
		return new Command(
			"create_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			async (correlationId: string, args: Parameters) => {
				let entity: Dummy = args.get("dummy");
				return await this._controller.create(correlationId, entity);
			}
		);
	}

	private makeUpdateCommand(): ICommand {
		return new Command(
			"update_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
			async (correlationId: string, args: Parameters) => {
				let entity: Dummy = args.get("dummy");
				return await this._controller.update(correlationId, entity);
			}
		);
	}

	private makeDeleteByIdCommand(): ICommand {
		return new Command(
			"delete_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
			async (correlationId: string, args: Parameters) => {
				let id = args.getAsString("dummy_id");
				return await this._controller.deleteById(correlationId, id);
			}
		);
	}

}