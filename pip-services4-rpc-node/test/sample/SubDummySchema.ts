import { TypeCode } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-data-node';

export class SubDummySchema extends ObjectSchema {

    public constructor() {
        super();
        this.withRequiredProperty("key", TypeCode.String);
        this.withOptionalProperty("content", TypeCode.String);
    }

}
