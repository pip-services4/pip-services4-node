import { IContext } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { ObjectSchema } from 'pip-services4-data-node';
import { FilterParamsSchema } from 'pip-services4-data-node';
import { PagingParamsSchema } from 'pip-services4-data-node';

import { CommandSet } from '../../src/commands/CommandSet';
import { ICommand } from '../../src/commands/ICommand';
import { Command } from '../../src/commands/Command';
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
        this.addCommand(this.makeCheckTraceIdCommand());
    }

    private makeGetPageByFilterCommand(): ICommand {
        return new Command(
            "get_dummies",
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
            async (context: IContext, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                return await this._service.getPageByFilter(context, filter, paging);
            }
        );
    }

    private makeGetOneByIdCommand(): ICommand {
        return new Command(
            "get_dummy_by_id",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            async (context: IContext, args: Parameters) => {
                let id = args.getAsString("dummy_id");
                return await this._service.getOneById(context, id);
            }
        );
    }

    private makeCreateCommand(): ICommand {
        return new Command(
            "create_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            async (context: IContext, args: Parameters) => {
                let entity: Dummy = args.get("dummy");
                return await this._service.create(context, entity);
            }
        );
    }

    private makeUpdateCommand(): ICommand {
        return new Command(
            "update_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema()),
            async (context: IContext, args: Parameters) => {
                let entity: Dummy = args.get("dummy");
                return await this._service.update(context, entity);
            }
        );
    }

    private makeDeleteByIdCommand(): ICommand {
        return new Command(
            "delete_dummy",
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            async (context: IContext, args: Parameters) => {
                let id = args.getAsString("dummy_id");
                return await this._service.deleteById(context, id);
            }
        );
    }

    private makeCheckTraceIdCommand(): ICommand {
        return new Command(
            "check_trace_id",
            new ObjectSchema(true),
            async (context: IContext, args: Parameters) => {
                let value = await this._service.checkTraceId(context);
                return { trace_id: value };
            }
        );
    }

    

}