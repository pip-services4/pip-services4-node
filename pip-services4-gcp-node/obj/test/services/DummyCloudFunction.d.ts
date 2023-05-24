import { CloudFunction } from '../../src/containers/CloudFunction';
export declare class DummyCloudFunction extends CloudFunction {
    constructor();
}
export declare const handler: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>) => Promise<any>;
