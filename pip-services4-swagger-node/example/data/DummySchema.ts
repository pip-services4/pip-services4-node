import { TypeCode } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-data-node';

export class DummySchema extends ObjectSchema {

    public constructor() {
        super();
        this.withOptionalProperty("id", TypeCode.String);
        this.withRequiredProperty("key", TypeCode.String);
        this.withOptionalProperty("content", TypeCode.String);
    }

}
