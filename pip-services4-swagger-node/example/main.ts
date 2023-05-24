const readline = require('readline');
const process = require('process');

import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { Referencer } from 'pip-services4-commons-node';
import { Opener } from 'pip-services4-commons-node';
import { Closer } from 'pip-services4-commons-node';

import { ConsoleLogger } from 'pip-services4-components-node';
import { LogCounters } from 'pip-services4-components-node';

import { HttpEndpoint } from 'pip-services4-rpc-node';
import { StatusRestService } from 'pip-services4-rpc-node';
import { HeartbeatRestService } from 'pip-services4-rpc-node';

import { SwaggerService } from '../src/services/SwaggerService';
import { DummyController } from './logic/DummyController';
import { DummyRestService } from './services/DummyRestService';
import { DummyCommandableHttpService } from './services/DummyCommandableHttpService';

let main = async () => {
    // Create components
    let logger = new ConsoleLogger();
    let controller = new DummyController();
    let httpEndpoint = new HttpEndpoint();
    let restService = new DummyRestService();
    let httpService = new DummyCommandableHttpService();
    let statusService = new StatusRestService();
    let heartbeatService = new HeartbeatRestService();
    let swaggerService = new SwaggerService();

    let components = [
        controller,
        httpEndpoint,
        restService,
        httpService,
        statusService,
        heartbeatService,
        swaggerService
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

    restService.configure(ConfigParams.fromTuples(
        'swagger.enable', true
    )); 

    httpService.configure(ConfigParams.fromTuples(
        'base_route', 'dummies2',
        'swagger.enable', true
    )); 

    try {
        // Set references
        let references = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services', 'counters', 'log', 'default', '1.0'), new LogCounters(),
            new Descriptor('pip-services', 'endpoint', 'http', 'default', '1.0'), httpEndpoint,
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-dummies', 'service', 'rest', 'default', '1.0'), restService,
            new Descriptor('pip-services-dummies', 'service', 'commandable-http', 'default', '1.0'), httpService,
            new Descriptor('pip-services', 'status-service', 'rest', 'default', '1.0'), statusService,
            new Descriptor('pip-services', 'heartbeat-service', 'rest', 'default', '1.0'), heartbeatService,
            new Descriptor('pip-services', 'swagger-service', 'http', 'default', '1.0'), swaggerService
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