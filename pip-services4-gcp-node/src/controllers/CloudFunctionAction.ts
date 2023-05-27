/** @module controllers */

import { Schema } from "pip-services4-data-node";
import { Request, Response } from "express";

export class CloudFunctionAction {
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
    public action: (req: Request, res: Response) => Promise<void>;
}