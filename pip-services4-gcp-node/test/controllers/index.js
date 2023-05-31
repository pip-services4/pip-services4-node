const DummyCloudFunction = require('../../obj/test/controllers/DummyCloudFunction').DummyCloudFunction;
const ConfigParams = require('../../node_modules/pip-services4-components-node/obj/src/config/ConfigParams').ConfigParams;


let functionController = new DummyCloudFunction();

// CommandableCloudFunctionController
exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:commandable-cloudfunc:default:1.0'
    );
    
    if (!functionController.isOpen()) {
        functionController.configure(config);
        await functionController.open(null);
    }
    
    let handler = functionController.getHandler();

    handler(req, res);
};

// CloudFunctionController
exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:cloudfunc:default:1.0'
    );

    if (!functionController.isOpen()) {
        functionController.configure(config);
        await functionController.open(null);
    }
    
    let handler = functionController.getHandler();

    handler(req, res);
};