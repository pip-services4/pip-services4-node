"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultInfoFactory = exports.ContextInfo = void 0;
/**
 * @module info
 *
 * Todo: Rewrite the description
 *
 * @preferred
 * Contains a simple object that defines the context of execution. For various
 * logging functions we need to know what source we are logging from – what is
 * the processes name, what the process is/does.
 */
var ContextInfo_1 = require("./ContextInfo");
Object.defineProperty(exports, "ContextInfo", { enumerable: true, get: function () { return ContextInfo_1.ContextInfo; } });
var DefaultInfoFactory_1 = require("./DefaultInfoFactory");
Object.defineProperty(exports, "DefaultInfoFactory", { enumerable: true, get: function () { return DefaultInfoFactory_1.DefaultInfoFactory; } });
//# sourceMappingURL=index.js.map