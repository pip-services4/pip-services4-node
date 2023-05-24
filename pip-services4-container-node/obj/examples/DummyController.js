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
exports.DummyController = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
class DummyController {
    constructor() {
        this._timer = new pip_services3_commons_node_1.FixedRateTimer(this, 1000, 1000);
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._message = "Hello World!";
        this._counter = 0;
    }
    get message() {
        return this._message;
    }
    set message(value) {
        this._message = value;
    }
    get counter() {
        return this._counter;
    }
    set counter(value) {
        this._counter = value;
    }
    configure(config) {
        this.message = config.getAsStringWithDefault("message", this.message);
    }
    setReferences(references) {
        this._logger.setReferences(references);
    }
    isOpen() {
        return this._timer.isStarted();
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.start();
            this._logger.trace(correlationId, "Dummy controller opened");
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.stop();
            this._logger.trace(correlationId, "Dummy controller closed");
        });
    }
    notify(correlationId, args) {
        this._logger.info(correlationId, "%d - %s", this.counter++, this.message);
    }
}
exports.DummyController = DummyController;
//# sourceMappingURL=DummyController.js.map