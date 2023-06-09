/** @module validate */
import { TypeCode } from 'pip-services4-commons-node';

import { ObjectSchema } from './ObjectSchema';

/**
 * Schema to validate [[PagingParams]].
 * 
 * @see [[PagingParams]]
 */
export class PagingParamsSchema extends ObjectSchema {

    /**
     * Creates a new instance of validation schema.
     */
    public constructor() {
        super();
        this.withOptionalProperty("skip", TypeCode.Long);
        this.withOptionalProperty("take", TypeCode.Long);
        this.withOptionalProperty("total", TypeCode.Boolean);
    }

}
