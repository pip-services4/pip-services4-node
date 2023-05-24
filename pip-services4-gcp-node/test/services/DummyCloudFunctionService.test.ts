import { DummyCloudFunctionFixture } from './DummyCloudFunctionFixture';

suite('DummyFunctionService', () => {

    let fixture: DummyCloudFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyCloudFunctionFixture('handler', 3000);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
