"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutOperations = void 0;
/** @module controllers */
const os = require("os");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const HttpRequestDetector_1 = require("./HttpRequestDetector");
const RestOperations_1 = require("./RestOperations");
class AboutOperations extends RestOperations_1.RestOperations {
    setReferences(references) {
        super.setReferences(references);
        this._contextInfo = references.getOneOptional(new pip_services4_components_node_1.Descriptor('pip-services', 'context-info', '*', '*', '*'));
    }
    getAboutOperation() {
        return (req, res) => {
            this.about(req, res);
        };
    }
    getNetworkAddresses() {
        const interfaces = os.networkInterfaces();
        const addresses = [];
        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        return addresses;
    }
    about(req, res) {
        const about = {
            server: {
                name: this._contextInfo != null ? this._contextInfo.name : 'unknown',
                description: this._contextInfo != null ? this._contextInfo.description : null,
                properties: this._contextInfo != null ? this._contextInfo.properties : null,
                uptime: this._contextInfo != null ? this._contextInfo.uptime : null,
                start_time: this._contextInfo != null ? this._contextInfo.startTime : null,
                current_time: new Date().toISOString(),
                protocol: req.protocol,
                host: HttpRequestDetector_1.HttpRequestDetector.detectServerHost(req),
                addresses: this.getNetworkAddresses(),
                port: HttpRequestDetector_1.HttpRequestDetector.detectServerPort(req),
                url: req.originalUrl,
            },
            client: {
                address: HttpRequestDetector_1.HttpRequestDetector.detectAddress(req),
                client: HttpRequestDetector_1.HttpRequestDetector.detectBrowser(req),
                platform: HttpRequestDetector_1.HttpRequestDetector.detectPlatform(req),
                user: req.user
            }
        };
        res.json(about);
    }
}
exports.AboutOperations = AboutOperations;
//# sourceMappingURL=AboutOperations.js.map