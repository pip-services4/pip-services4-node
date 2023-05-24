const DummyCloudFunction = require('../../obj/test/services/DummyCloudFunction').DummyCloudFunction;
const ConfigParams = require('../../node_modules/pip-services4-commons-node/obj/src/config/ConfigParams').ConfigParams;


let functionService = new DummyCloudFunction();

// CommandableCloudFunctionService
exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:commandable-cloudfunc:default:1.0'
    );
    
    if (!functionService.isOpen()) {
        functionService.configure(config);
        await functionService.open(null);
    }
    
    let handler = functionService.getHandler();

    handler(req, res);
};

// CloudFunctionService
exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:cloudfunc:default:1.0'
    );

    if (!functionService.isOpen()) {
        functionService.configure(config);
        await functionService.open(null);
    }
    
    let handler = functionService.getHandler();

    handler(req, res);
};