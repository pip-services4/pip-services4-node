"use strict";
/** @module clients */
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
exports.DataDogLogClient = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
class DataDogLogClient extends pip_services4_http_node_1.RestClient {
    constructor(config) {
        super();
        this._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "https", "connection.host", "http-intake.logs.datadoghq.com", "connection.port", 443, "credential.internal_network", "true");
        this._credentialResolver = new pip_services4_config_node_1.CredentialResolver();
        if (config)
            this.configure(config);
        this._baseRoute = "v1";
    }
    configure(config) {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }
    setReferences(refs) {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }
    open(context) {
        const _super = Object.create(null, {
            open: { get: () => super.open }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield this._credentialResolver.lookup(context);
            if (credential == null || credential.getAccessKey() == null) {
                throw new pip_services4_commons_node_1.ConfigException(context != null ? ContextResolver.getTraceId(context) : null, "NO_ACCESS_KEY", "Missing access key in credentials");
            }
            this._headers = this._headers || {};
            this._headers['DD-API-KEY'] = credential.getAccessKey();
            yield _super.open.call(this, context);
        });
    }
    convertTags(tags) {
        if (tags == null)
            return null;
        let builder = "";
        for (const key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }
    convertMessage(message) {
        const result = {
            "timestamp": pip_services4_commons_node_1.StringConverter.toString(message.time || new Date()),
            "status": message.status || "INFO",
            "ddsource": message.source || 'pip-services',
            //            "source": message.source || 'pip-services',
            "service": message.service,
            "message": message.message,
        };
        if (message.tags)
            result['ddtags'] = this.convertTags(message.tags);
        if (message.host)
            result['host'] = message.host;
        if (message.logger_name)
            result['logger.name'] = message.logger_name;
        if (message.thread_name)
            result['logger.thread_name'] = message.thread_name;
        if (message.error_message)
            result['error.message'] = message.error_message;
        if (message.error_kind)
            result['error.kind'] = message.error_kind;
        if (message.error_stack)
            result['error.stack'] = message.error_stack;
        return result;
    }
    convertMessages(messages) {
        return messages.map((m) => { return this.convertMessage(m); });
    }
    sendLogs(context, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.convertMessages(messages);
            // Commented instrumentation because otherwise it will never stop sending logs...
            //let timing = this.instrument(context, "datadog.send_logs");
            try {
                yield this.call("post", "input", null, null, data);
            }
            finally {
                //timing.endTiming();
            }
        });
    }
}
exports.DataDogLogClient = DataDogLogClient;
//# sourceMappingURL=DataDogLogClient.js.map