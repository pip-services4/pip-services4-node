/** @module validate */
import { TypeCode } from 'pip-services4-commons-node';

import { ArraySchema } from './ArraySchema';

/**
 * Schema to validate [[ProjectionParams]]
 * 
 * @see [[ProjectionParams]]
 */
export class ProjectionParamsSchema extends ArraySchema {

    /**
     * Creates a new instance of validation schema.
     */
    public constructor() {
        super(TypeCode.String);
    }

}
