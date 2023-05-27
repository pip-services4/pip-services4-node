const readline = require('readline');
const process = require('process');

import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { Referencer } from 'pip-services4-components-node';
import { Opener } from 'pip-services4-components-node';
import { Closer } from 'pip-services4-components-node';

import { ConsoleLogger } from 'pip-services4-observability-node';
import { LogCounters } from 'pip-services4-observability-node';

import { HttpEndpoint } from 'pip-services4-http-node';
import { StatusRestController } from 'pip-services4-http-node';
import { HeartbeatRestController } from 'pip-services4-http-node';

import { SwaggerController } from '../src/controllers/SwaggerController';
import { DummyService} from './services/DummyService';
import { DummyRestController } from './controllers/DummyRestController';
import { DummyCommandableHttpController } from './controllers/DummyCommandableHttpController';

let main = async () => {
    // Create components
    let logger = new ConsoleLogger();
    let service = new DummyService();
    let httpEndpoint = new HttpEndpoint();
    let restController = new DummyRestController();
    let httpController = new DummyCommandableHttpController();
    let statusController = new StatusRestController();
    let heartbeatController = new HeartbeatRestController();
    let swaggerController = new SwaggerController();

    let components = [
        service,
        httpEndpoint,
        restController,
        httpController,
        statusController,
        heartbeatController,
        swaggerController
    ];

    // Configure components
    logger.configure(ConfigParams.fromTuples(
        'level', 'trace'
    ));

    httpEndpoint.configure(ConfigParams.fromTuples(
        'connection.protocol', 'http',
        'connection.host', 'localhost',
        'connection.port', 8080
    ));

    restController.configure(ConfigParams.fromTuples(
        'swagger.enable', true
    )); 

    httpController.configure(ConfigParams.fromTuples(
        'base_route', 'dummies2',
        'swagger.enable', true
    )); 

    try {
        // Set references
        let references = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services', 'counters', 'log', 'default', '1.0'), new LogCounters(),
            new Descriptor('pip-services', 'endpoint', 'http', 'default', '1.0'), httpEndpoint,
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), restController,
            new Descriptor('pip-services-dummies', 'controller', 'commandable-http', 'default', '1.0'), httpController,
            new Descriptor('pip-services', 'status-controller', 'rest', 'default', '1.0'), statusController,
            new Descriptor('pip-services', 'heartbeat-controller', 'rest', 'default', '1.0'), heartbeatController,
            new Descriptor('pip-services', 'swagger-controller', 'http', 'default', '1.0'), swaggerController
        );

        Referencer.setReferences(references, components);

        // Open components
        await Opener.open(null, components);

        // Wait until user presses ENTER
        const file = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
            
        await new Promise((resolve, reject) => {
            file.question('Press Ctrl-C twice to stop the microservice...', resolve);
        });                  

        Closer.close(null, components);
        process.exit(0);
    } catch (ex) {
        logger.error(null, ex, 'Failed to execute the microservice');
        process.exit(1);
    }
}

main();