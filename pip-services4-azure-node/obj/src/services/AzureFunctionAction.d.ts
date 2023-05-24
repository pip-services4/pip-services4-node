/** @module services */
import { Schema } from "pip-services4-commons-node";
export declare class AzureFunctionAction {
    /**
     * Command to call the action
     */
    cmd: string;
    /**
     * Schema to validate action parameters
     */
    schema: Schema;
    /**
     * Action to be executed
     */
    action: (context: any) => Promise<any>;
}
