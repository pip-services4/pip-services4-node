const assert = require("chai").assert;

import {
  ConfigParams,
  Descriptor,
  References,
} from "pip-services4-components-node";
import { Dummy } from "../Dummy";
import { DummyFilePersistence } from "../DummyFilePersistence";
import { DummySingleService } from "../DummySingleService";
import { CreateDummyLambdaFunction } from "./CreateDummyLambdaFunction";

suite("CreateDummyLambdaSingleFunction.test", () => {
  let DUMMY1: Dummy = { id: null, key: "Key 1", content: "Content 1" };
  let DUMMY2: Dummy = { id: null, key: "Key 2", content: "Content 2" };

  let createLambda: CreateDummyLambdaFunction;
  let persistence: DummyFilePersistence;

  suiteSetup(async () => {
    persistence = new DummyFilePersistence("./data/dummies.json");
    let service = new DummySingleService();
    const references = References.fromTuples(
      new Descriptor("pip-services-dummies", "persistence", "file", "*", "1.0"),
      persistence,
      new Descriptor(
        "pip-services-dummies",
        "service",
        "single-service",
        "*",
        "1.0"
      ),
      service
    );

    service.setReferences(references);

    let config = ConfigParams.fromTuples(
      "logger.descriptor",
      "pip-services:logger:console:default:1.0",
      "service.descriptor",
      "pip-services-dummies:service:single-service:default:1.0",
      "persistence.descriptor",
      "pip-services-dummies:persistence:file:default:1.0",
      "persistence.path",
      "./data/dummies.json"
    );
    service.configure(config);

    createLambda = new CreateDummyLambdaFunction();

    createLambda.configure(config);

    createLambda.setReferences(references);

    await persistence.open(null);    
    await persistence.clear(null);
    await persistence.close(null);

    await createLambda.open(null);
    
  });

  suiteTeardown(async () => {
    await createLambda.close(null);
  });

  test("Create Dummies Operations", async () => {
    // Create one dummy
    let dummy1 = await createLambda.act({
      dummy: DUMMY1,
    });
    assert.isObject(dummy1);
    assert.equal(dummy1.content, DUMMY1.content);
    assert.equal(dummy1.key, DUMMY1.key);

    // Create another dummy
    let dummy2 = await createLambda.act({
      dummy: DUMMY2,
    });
    assert.isObject(dummy2);
    assert.equal(dummy2.content, DUMMY2.content);
    assert.equal(dummy2.key, DUMMY2.key);
  });
});
