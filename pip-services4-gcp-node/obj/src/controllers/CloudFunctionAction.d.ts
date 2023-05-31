/** @module controllers */
import { Schema } from "pip-services4-data-node";
import { Request, Response } from "express";
export declare class CloudFunctionAction {
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
    action: (req: Request, res: Response) => Promise<void>;
}
