/** @module persistence */
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ICleanable } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';

import { ILoader } from '../ILoader';
import { ISaver } from '../ISaver';

/**
 * Abstract persistence component that stores data in memory.
 * 
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._items</code> property and calling [[save]] method.
 * 
 * The component supports loading and saving items from another data source.
 * That allows to use it as a base class for file and other types
 * of persistence components that cache all data in memory. 
 * 
 * ### Configuration parameters ###
 * 
 * - options:
 *     - max_page_size:       Maximum number of items returned in a single page (default: 100)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * 
 * ### Example ###
 * 
 *     class MyMemoryPersistence extends MemoryPersistence<MyData> {
 *          
 *         public async getByName(context: IContext, name: string): Promise<MyData> {
 *             let item = this._items.find((d) => d.name == name);
 *             return item;
 *         }); 
 *       
 *         public set(correlatonId: string, item: MyData): Promise<MyData> {
 *             this._items = this._items.find((d) => d.name != name);
 *             this._items.push(item);
 *             await this.save(context);
 *             return item;
 *         }
 *       
 *     }
 * 
 *     let persistence = new MyMemoryPersistence();
 *     
 *     let item = await persistence.set("123", { name: "ABC" });
 *     item = await persistence.getByName("123", "ABC");
 *     console.log(item);                   // Result: { name: "ABC" }
 */
export class MemoryPersistence<T> implements IConfigurable, IReferenceable, IOpenable, ICleanable {
    protected _logger: CompositeLogger = new CompositeLogger();
    protected _items: T[] = [];
    protected _loader: ILoader<T>;
    protected _saver: ISaver<T>;
    protected _opened: boolean = false;
    protected _maxPageSize: number = 100;

    /**
     * Creates a new instance of the persistence.
     * 
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    public constructor(loader?: ILoader<T>, saver?: ISaver<T>) {
        this._loader = loader;
        this._saver = saver;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        await this.load(context);
        this._opened = true;
    }

    protected async load(context: IContext): Promise<void> {
        if (this._loader == null) {
            return null;
        }
            
        this._items = await this._loader.load(context);

        this._logger.trace(context, "Loaded %d items", this._items.length);
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        await this.save(context);

        this._opened = false;
    }

    /**
     * Saves items to external data source using configured saver component.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    public async save(context: IContext): Promise<void> {
        if (this._saver == null) {
            return;
        }

        await this._saver.save(context, this._items);

        this._logger.trace(context, "Saved %d items", this._items.length);
    }

    /**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async clear(context: IContext): Promise<void> {
        this._items = [];

        this._logger.trace(context, "Cleared items");

        await this.save(context);
    }

    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     * 
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting parameters
     * @param select            (optional) projection parameters (not used yet)
     * @returns                 a requested page with data items.
     */
    protected async getPageByFilter(context: IContext, filter: any, 
        paging: PagingParams, sort: any, select: any): Promise<DataPage<T>> {
        
        let items = this._items;

        // Filter and sort
        if (typeof filter === "function") {
            items = items.filter(filter);
        }
        if (typeof sort === "function") {
            items = items.sort((a, b) => {
                let sa = sort(a);
                let sb = sort(b);
                if (sa < sb) return -1;
                if (sa > sb) return 1;
                return 0;
            });
        }

        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total) {
            total = items.length;
        }
        
        if (skip > 0) {
            items = items.slice(skip);
        }
        items = items.slice(0, take);
        
        this._logger.trace(context, "Retrieved %d items", items.length);
        
        return new DataPage<T>(items, total);
    }

    /**
     * Gets a number of items retrieved by a given filter.
     * 
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @returns                 a number of data items that satisfy the filter.
     */
    protected async getCountByFilter(context: IContext, filter: any): Promise<number> {
        let items = this._items;

        // Filter and sort
        if (typeof filter === "function") {
            items = items.filter(filter);
        }

        this._logger.trace(context, "Counted %d items", items.length);
        
        return items.length;
    }

    /**
     * Gets a list of data items retrieved by a given filter and sorted according to sort parameters.
     * 
     * This method shall be called by a public getListByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param filter           (optional) a filter function to filter items
     * @param paging           (optional) paging parameters
     * @param sort             (optional) sorting parameters
     * @param select           (optional) projection parameters (not used yet)
     * @returns                a list with found data items.
     */
    protected async getListByFilter(context: IContext, filter: any, sort: any, select: any): Promise<T[]> {
        let items = this._items;

        // Apply filter
        if (typeof filter === "function") {
            items = items.filter(filter);
        }

        // Apply sorting
        if (typeof sort === "function") { 
            items = items.sort((a, b) => {
                let sa = sort(a);
                let sb = sort(b);
                if (sa < sb) return -1;
                if (sa > sb) return 1;
                return 0;
            });
        }
        
        this._logger.trace(context, "Retrieved %d items", items.length);
        
        return items;
    }

    /**
     * Gets a random item from items that match to a given filter.
     * 
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     * @returns                 a random data item.
     */
    protected async getOneRandom(context: IContext, filter: any): Promise<T> {
        let items = this._items;

        // Apply filter
        if (typeof filter === "function") {
            items = items.filter(filter);
        }

        let index = Math.trunc(items.length * Math.random())
        let item: T = items.length > 0 ? items[index] : null;
        
        if (item != null) {
            this._logger.trace(context, "Retrieved a random item");
        } else {
            this._logger.trace(context, "Nothing to return as random item");
        }
                        
        return item;
    }

    /**
     * Creates a data item.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 a created data item
     */
    public async create(context: IContext, item: T): Promise<T> {
        // Clone the object
        item = Object.assign({}, item);

        this._items.push(item);
        this._logger.trace(context, "Created item %s", item['id']);

        await this.save(context);

        return item;
    }

    /**
     * Deletes data items that match to a given filter.
     * 
     * This method shall be called by a public deleteByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     */
    protected async deleteByFilter(context: IContext, filter: any): Promise<void> {
        let deleted = 0;
        for (let index = this._items.length - 1; index>= 0; index--) {
            let item = this._items[index];
            if (filter(item)) {
                this._items.splice(index, 1);
                deleted++;
            }
        }

        if (deleted == 0) {
            return;
        }

        this._logger.trace(context, "Deleted %s items", deleted);

        await this.save(context);
    }

}
