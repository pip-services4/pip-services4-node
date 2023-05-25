"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfigReaderFactory = exports.YamlConfigReader = exports.MemoryConfigReader = exports.JsonConfigReader = exports.FileConfigReader = exports.ConfigReader = void 0;
/**
 * @module config
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains implementation of the config design pattern.
 *
 * ConfigReader's Parameterize method allows us to take a standard configuration, and,
 * using a set of current parameters (e.g. environment variables), parameterize it. When
 * we create the configuration of a container, we can use environment variables to tailor
 * it to the system, dynamically add addresses, ports, etc.
 */
var ConfigReader_1 = require("./ConfigReader");
Object.defineProperty(exports, "ConfigReader", { enumerable: true, get: function () { return ConfigReader_1.ConfigReader; } });
var FileConfigReader_1 = require("./FileConfigReader");
Object.defineProperty(exports, "FileConfigReader", { enumerable: true, get: function () { return FileConfigReader_1.FileConfigReader; } });
var JsonConfigReader_1 = require("./JsonConfigReader");
Object.defineProperty(exports, "JsonConfigReader", { enumerable: true, get: function () { return JsonConfigReader_1.JsonConfigReader; } });
var MemoryConfigReader_1 = require("./MemoryConfigReader");
Object.defineProperty(exports, "MemoryConfigReader", { enumerable: true, get: function () { return MemoryConfigReader_1.MemoryConfigReader; } });
var YamlConfigReader_1 = require("./YamlConfigReader");
Object.defineProperty(exports, "YamlConfigReader", { enumerable: true, get: function () { return YamlConfigReader_1.YamlConfigReader; } });
var DefaultConfigReaderFactory_1 = require("./DefaultConfigReaderFactory");
Object.defineProperty(exports, "DefaultConfigReaderFactory", { enumerable: true, get: function () { return DefaultConfigReaderFactory_1.DefaultConfigReaderFactory; } });
//# sourceMappingURL=index.js.map