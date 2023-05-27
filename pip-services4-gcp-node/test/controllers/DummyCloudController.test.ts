import { DummyCloudFunctionFixture } from './DummyCloudFunctionFixture';

suite('DummyCloudController', () => {

    let fixture: DummyCloudFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyCloudFunctionFixture('handler', 3000);
        await fixture.startCloudControllerLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudControllerLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
