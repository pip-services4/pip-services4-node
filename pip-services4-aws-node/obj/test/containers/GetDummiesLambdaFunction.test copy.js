// const assert = require("chai").assert;
// import {
//   ConfigParams,
//   Descriptor,
//   References,
// } from "pip-services4-components-node";
// import { Dummy } from "../Dummy";
// import { CreateDummyLambdaFunction } from "./CreateDummyLambdaFunction";
// import { GetDummiesLambdaFunction } from "./GetDummiesLambdaFunction";
// import { DummySingleService } from "../DummySingleService";
// import { DummyFilePersistence } from "../DummyFilePersistence";
// import { FilterParams } from "pip-services4-data-node";
// suite("DummyLambdaSingleFunction.test", () => {
//   let DUMMY1: Dummy = { id: null, key: "Key 1", content: "Content 1" };
//   let DUMMY2: Dummy = { id: null, key: "Key 2", content: "Content 2" };
//   let createLambda: CreateDummyLambdaFunction;
//   let getLambda: GetDummiesLambdaFunction;
//   let persistence: DummyFilePersistence;
//   suiteSetup(async () => {
//     persistence = new DummyFilePersistence("./data/dummies.json");
//     persistence.configure(
//       ConfigParams.fromTuples("path", "./data/dummies.json")
//     );
//     let service = new DummySingleService();
//     const references = References.fromTuples(
//       new Descriptor("pip-services-dummies", "persistence", "file", "*", "1.0"),
//       persistence,
//       new Descriptor(
//         "pip-services-dummies",
//         "service",
//         "single-service",
//         "*",
//         "1.0"
//       ),
//       service
//     );
//     service.setReferences(references);
//     let config = ConfigParams.fromTuples(
//       "logger.descriptor",
//       "pip-services:logger:console:default:1.0",
//       "service.descriptor",
//       "pip-services-dummies:service:single-service:default:1.0",
//       "persistence.descriptor",
//       "pip-services-dummies:persistence:file:default:1.0",
//       "persistence.path",
//       "./data/dummies.json"
//     );
//     service.configure(config);
//     createLambda = new CreateDummyLambdaFunction();
//     getLambda = new GetDummiesLambdaFunction();
//     createLambda.configure(config);
//     getLambda.configure(config);
//     createLambda.setReferences(references);
//     getLambda.setReferences(references);
//     await persistence.open(null);
//     await persistence.clear(null);
//     await createLambda.open(null);
//     await getLambda.open(null);
//   });
//   suiteTeardown(async () => {
//     await createLambda.close(null);
//     await getLambda.close(null);
//     await persistence.close(null);
//   });
//   test("Create Dummies Operations", async () => {
//     // Create one dummy
//     let dummy1 = await createLambda.act({
//       dummy: DUMMY1,
//     });
//     assert.isObject(dummy1);
//     assert.equal(dummy1.content, DUMMY1.content);
//     assert.equal(dummy1.key, DUMMY1.key);
//     // Create another dummy
//     let dummy2 = await createLambda.act({
//       dummy: DUMMY2,
//     });
//     assert.isObject(dummy2);
//     assert.equal(dummy2.content, DUMMY2.content);
//     assert.equal(dummy2.key, DUMMY2.key);
//   });
//   test("Get Dummies Operations", async () => {
//     // Get all dummies
//     const page = await getLambda.act({
//       filter: new FilterParams(),
//     });
//     assert.isObject(page);
//     assert.lengthOf(page.data, 2);
//   });
// });
//# sourceMappingURL=GetDummiesLambdaFunction.test%20copy.js.map