"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusOperations = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const RestOperations_1 = require("./RestOperations");
class StatusOperations extends RestOperations_1.RestOperations {
    constructor() {
        super();
        this._startTime = new Date();
        this._dependencyResolver.put("context-info", new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references2 = references;
        super.setReferences(references);
        this._contextInfo = this._dependencyResolver.getOneOptional("context-info");
    }
    getStatusOperation() {
        return (req, res) => {
            this.status(req, res);
        };
    }
    /**
     * Handles status requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    status(req, res) {
        const id = this._contextInfo != null ? this._contextInfo.contextId : "";
        const name = this._contextInfo != null ? this._contextInfo.name : "Unknown";
        const description = this._contextInfo != null ? this._contextInfo.description : "";
        const uptime = new Date().getTime() - this._startTime.getTime();
        const properties = this._contextInfo != null ? this._contextInfo.properties : "";
        const components = [];
        if (this._references2 != null) {
            for (const locator of this._references2.getAllLocators())
                components.push(locator.toString());
        }
        const status = {
            id: id,
            name: name,
            description: description,
            start_time: pip_services4_commons_node_1.StringConverter.toString(this._startTime),
            current_time: pip_services4_commons_node_1.StringConverter.toString(new Date()),
            uptime: uptime,
            properties: properties,
            components: components
        };
        this.sendResult(req, res, status);
    }
}
exports.StatusOperations = StatusOperations;
//# sourceMappingURL=StatusOperations.js.map