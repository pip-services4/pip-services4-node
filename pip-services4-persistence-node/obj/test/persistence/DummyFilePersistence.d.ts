import { ConfigParams } from 'pip-services4-components-node';
import { JsonFilePersister } from '../../src/persistence/JsonFilePersister';
import { DummyMemoryPersistence } from './DummyMemoryPersistence';
import { Dummy } from '../sample/Dummy';
export declare class DummyFilePersistence extends DummyMemoryPersistence {
    protected _persister: JsonFilePersister<Dummy>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
