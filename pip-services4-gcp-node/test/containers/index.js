const DummyCommandableCloudFunction = require('../../obj/test/containers/DummyCommandableCloudFunction').DummyCommandableCloudFunction;
const DummyCloudFunction = require('../../obj/test/containers/DummyCloudFunction').DummyCloudFunction;
const ConfigParams = require('../../node_modules/pip-services4-commons-node/obj/src/config/ConfigParams').ConfigParams;

// CommandableCloudFunction
let commandableFunction = null;

exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0'
    );

    if (commandableFunction == null) {
        commandableFunction = new DummyCommandableCloudFunction();
        commandableFunction.configure(config);
        await commandableFunction.open(null);
    }

    let handler = commandableFunction.getHandler();
    handler(req, res);
};


// CloudFunction
let gFunction = null;

exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0'
    );
    
    if (gFunction == null) {
        gFunction = new DummyCloudFunction();
        gFunction.configure(config);
        await gFunction.open(null);
    }

    let handler = gFunction.getHandler();
    handler(req, res);
};