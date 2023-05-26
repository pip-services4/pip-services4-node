"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DummyProcess_1 = require("./DummyProcess");
try {
    new DummyProcess_1.DummyProcess().run(process.argv);
}
catch (ex) {
    console.error(ex);
}
//# sourceMappingURL=app.js.map