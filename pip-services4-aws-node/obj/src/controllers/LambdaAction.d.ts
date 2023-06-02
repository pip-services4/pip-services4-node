/** @module controllers */
import { Schema } from "pip-services4-data-node";
export declare class LambdaAction {
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
    action: (params: any) => Promise<any>;
}
