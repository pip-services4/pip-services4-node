const assert = require("chai").assert;

import {
    ConfigParams,
    Descriptor,
    References,
} from "pip-services4-components-node";
import { FilterParams } from "pip-services4-data-node";
import { DummyFilePersistence } from "../DummyFilePersistence";
import { DummySingleService } from "../DummySingleService";
import { GetDummiesLambdaFunction } from "./GetDummiesLambdaFunction";

suite("GetDummiesLambdaSingleFunction.test", () => {
  let getLambda: GetDummiesLambdaFunction;
  let persistence: DummyFilePersistence;

  suiteSetup(async () => {
    persistence = new DummyFilePersistence("./data/dummies.json");
    persistence.configure(
      ConfigParams.fromTuples("path", "./data/dummies.json")
    );
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

    getLambda = new GetDummiesLambdaFunction();
    getLambda.configure(config);
    getLambda.setReferences(references);

    await getLambda.open(null);
  });

  suiteTeardown(async () => {
    await getLambda.close(null);
  });

  test("Get Dummies Operations", async () => {
    // Get all dummies
    const page = await getLambda.act({
      filter: new FilterParams(),
    });
    assert.isObject(page);
    assert.lengthOf(page.data, 2);
  });
});
