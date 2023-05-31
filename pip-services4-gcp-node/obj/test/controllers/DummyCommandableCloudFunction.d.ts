import { CommandableCloudFunction } from '../../src/containers/CommandableCloudFunction';
export declare class DummyCommandableCloudFunction extends CommandableCloudFunction {
    constructor();
}
export declare const commandableHandler: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>) => Promise<any>;
