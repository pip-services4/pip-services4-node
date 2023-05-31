"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const process = require("process");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const pip_services4_components_node_4 = require("pip-services4-components-node");
const pip_services4_components_node_5 = require("pip-services4-components-node");
const pip_services4_components_node_6 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const pip_services4_http_node_2 = require("pip-services4-http-node");
const pip_services4_http_node_3 = require("pip-services4-http-node");
const SwaggerController_1 = require("../src/controllers/SwaggerController");
const DummyService_1 = require("./services/DummyService");
const DummyRestController_1 = require("./controllers/DummyRestController");
const DummyCommandableHttpController_1 = require("./controllers/DummyCommandableHttpController");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create components
    const logger = new pip_services4_observability_node_1.ConsoleLogger();
    const service = new DummyService_1.DummyService();
    const httpEndpoint = new pip_services4_http_node_1.HttpEndpoint();
    const restController = new DummyRestController_1.DummyRestController();
    const httpController = new DummyCommandableHttpController_1.DummyCommandableHttpController();
    const statusController = new pip_services4_http_node_2.StatusRestController();
    const heartbeatController = new pip_services4_http_node_3.HeartbeatRestController();
    const swaggerController = new SwaggerController_1.SwaggerController();
    const components = [
        service,
        httpEndpoint,
        restController,
        httpController,
        statusController,
        heartbeatController,
        swaggerController
    ];
    // Configure components
    logger.configure(pip_services4_components_node_1.ConfigParams.fromTuples('level', 'trace'));
    httpEndpoint.configure(pip_services4_components_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.host', 'localhost', 'connection.port', 8080));
    restController.configure(pip_services4_components_node_1.ConfigParams.fromTuples('swagger.enable', true));
    httpController.configure(pip_services4_components_node_1.ConfigParams.fromTuples('base_route', 'dummies2', 'swagger.enable', true));
    try {
        // Set references
        const references = pip_services4_components_node_2.References.fromTuples(new pip_services4_components_node_3.Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger, new pip_services4_components_node_3.Descriptor('pip-services', 'counters', 'log', 'default', '1.0'), new pip_services4_observability_node_2.LogCounters(), new pip_services4_components_node_3.Descriptor('pip-services', 'endpoint', 'http', 'default', '1.0'), httpEndpoint, new pip_services4_components_node_3.Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service, new pip_services4_components_node_3.Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), restController, new pip_services4_components_node_3.Descriptor('pip-services-dummies', 'controller', 'commandable-http', 'default', '1.0'), httpController, new pip_services4_components_node_3.Descriptor('pip-services', 'status-controller', 'rest', 'default', '1.0'), statusController, new pip_services4_components_node_3.Descriptor('pip-services', 'heartbeat-controller', 'rest', 'default', '1.0'), heartbeatController, new pip_services4_components_node_3.Descriptor('pip-services', 'swagger-controller', 'http', 'default', '1.0'), swaggerController);
        pip_services4_components_node_4.Referencer.setReferences(references, components);
        // Open components
        yield pip_services4_components_node_5.Opener.open(null, components);
        // Wait until user presses ENTER
        const file = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        yield new Promise((resolve, reject) => {
            file.question('Press Ctrl-C twice to stop the microservice...', resolve);
        });
        pip_services4_components_node_6.Closer.close(null, components);
        process.exit(0);
    }
    catch (ex) {
        logger.error(null, ex, 'Failed to execute the microservice');
        process.exit(1);
    }
});
main();
//# sourceMappingURL=main.js.map