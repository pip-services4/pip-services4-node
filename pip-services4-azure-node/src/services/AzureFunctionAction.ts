/** @module services */

import { Schema } from "pip-services4-commons-node";

export class AzureFunctionAction {
    /**
     * Command to call the action
     */
    public cmd: string;

    /**
     * Schema to validate action parameters
     */
    public schema: Schema;

    /**
     * Action to be executed
     */
    public action: (context: any) => Promise<any>;
}