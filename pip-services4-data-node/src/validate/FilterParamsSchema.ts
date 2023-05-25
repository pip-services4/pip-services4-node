/** @module validate */
import { TypeCode } from 'pip-services4-commons-node';
import { MapSchema } from './MapSchema';

/**
 * Schema to validate [[FilterParams]].
 * 
 * @see [[FilterParams]]
 */
export class FilterParamsSchema extends MapSchema {

    /**
     * Creates a new instance of validation schema.
     */
    public constructor() {
        super(TypeCode.String, null);
    }

}
