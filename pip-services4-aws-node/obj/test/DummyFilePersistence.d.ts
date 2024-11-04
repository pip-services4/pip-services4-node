import { ConfigParams } from 'pip-services4-components-node';
import { DummyMemoryPersistence } from './DummyMemoryPersistence';
import { Dummy } from './Dummy';
import { JsonFilePersister } from 'pip-services4-persistence-node';
export declare class DummyFilePersistence extends DummyMemoryPersistence {
    protected _persister: JsonFilePersister<Dummy>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
