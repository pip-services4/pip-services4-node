# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> SQLServer components for Pip.Services in Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The module contains the following packages:

- **Build** - a standard factory for constructing components
- **Connect** - instruments for configuring connections to the database.
- **Persistence** - abstract classes for working with the database that can be used for connecting to collections and performing basic CRUD operations


<a name="links"></a> Quick links:

* [Configuration](https://www.pipservices.org/recipies/configuration)
* [API Reference](https://pip-services4-node.github.io/pip-services4-sqlserver-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)

## Use

Install the NPM package as
```bash
npm install pip-services4-sqlserver-node --save
```

As an example, lets create persistence for the following data object.

```typescript
import { IIdentifiable } from 'pip-services4-commons-node';

export class MyObject implements IIdentifiable {
  public id: string;
  public key: string;
  public value: number;
}
```

The persistence component shall implement the following interface with a basic set of CRUD operations.

```typescript
export interface IMyPersistence {
  getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
    callback: (err: any, page: DataPage<MyObject>) => void): void;
    
  getOneById(correlationId: string, id: string, callback: (err: any, item: MyObject) => void): void;
    
  getOneByKey(correlationId: string, key: string, callback: (err: any, item: MyObject) => void): void;
    
  create(correlationId: string, item: MyObject, callback?: (err: any, item: MyObject) => void): void;
    
  update(correlationId: string, item: MyObject, callback?: (err: any, item: MyObject) => void): void;
    
  deleteById(correlationId: string, id: string, callback?: (err: any, item: MyObject) => void): void;
}
```

To implement sql server persistence component you shall inherit `IdentifiableSqlServerPersistence`. 
Most CRUD operations will come from the base class. You only need to override `getPageByFilter` method with a custom filter function.
And implement a `getOneByKey` custom persistence method that doesn't exist in the base class.

```typescript
import { IdentifiableSqlServerPersistence } from 'pip-services4-sqlserver-node';

export class MySqlServerPersistence extends IdentifableSqlServerPersistence {
  public constructor() {
    super("myobjects");
    this.ensureSchema("CREATE TABLE [myobjects] ([id] VARCHAR(32) PRIMARY KEY, [key] VARCHAR(50), [value] NVARCHAR(255)");
    this.ensureIndex("myobjects_key", { '[key]': 1 }, { unique: true });
  }

  private composeFilter(filter: FilterParams): any {
    filter = filter || new FilterParams();
    
    let criteria = [];

    let id = filter.getAsNullableString('id');
    if (id != null)
        criteria.push("[id]='" + id + "'");

    let tempIds = filter.getAsNullableString("ids");
    if (tempIds != null) {
        let ids = tempIds.split(",");
        filters.push("[id] IN ('" + ids.join("','") + "')");
    }

    let key = filter.getAsNullableString("key");
    if (key != null)
        criteria.push("[key]='" + key + "'");

    return criteria.length > 0 ? criteria.join(" AND ") : null;
  }
  
  public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
    callback: (err: any, page: DataPage<MyObject>) => void): void {
    super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "id", null, callback);
  }  
  
  public getOneByKey(correlationId: string, key: string,
    callback: (err: any, item: MyObject) => void): void {
    
    let query = "SELECT * FROM " + this.quotedTableName() + " WHERE [key]=@1";
    let params = [ key ];

    let request = this.createRequest(params);
    request.query(query, (err, result) => {
      err = err || null;

      let item = result && result.recordset ? result.recordset[0] || null : null; 

      if (item == null)
        this._logger.trace(correlationId, "Nothing found from %s with key = %s", this._tableName, key);
      else
        this._logger.trace(correlationId, "Retrieved from %s with key = %s", this._tableName, key);

      item = this.convertToPublic(item);
      callback(err, item);
    });
  }

}
```

Alternatively you can store data in non-relational format using `IdentificableJsonSqlServerPersistence`.
It stores data in tables with two columns - `id` with unique object id and `data` with object data serialized as JSON.
To access data fields you shall use `JSON_VALUE([data],'$.field')` expression.

```typescript
import { IdentifiableJsonSqlServerPersistence } from 'pip-services4-sqlserver-node';

export class MySqlServerPersistence extends IdentifableJsonSqlServerPersistence {
  public constructor() {
    super("myobjects");
    this.ensureTable();
    this.autoCreateObject("ALTER TABLE [myobjects] ADD [data_key] AS JSON_VALUE([data],'$.key')")
    this.ensureIndex('myobjects_key', { data_key: 1 }, { unique: true });
  }

  private composeFilter(filter: FilterParams): any {
    filter = filter || new FilterParams();
    
    let criteria = [];

    let id = filter.getAsNullableString('id');
    if (id != null)
        criteria.push("JSON_VALUE([data],'$.id')='" + id + "'");

    let tempIds = filter.getAsNullableString("ids");
    if (tempIds != null) {
        let ids = tempIds.split(",");
        filters.push("JSON_VALUE([data],'$.id') IN ('" + ids.join("','") + "')");
    }

    let key = filter.getAsNullableString("key");
    if (key != null)
        criteria.push("JSON_VALUE([data],'$.key')='" + key + "'");

    return criteria.length > 0 ? criteria.join(" AND ") : null;
  }
  
  public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
    callback: (err: any, page: DataPage<MyObject>) => void): void {
    super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "id", null, callback);
  }  
  
  public getOneByKey(correlationId: string, key: string,
    callback: (err: any, item: MyObject) => void): void {
    
    let query = "SELECT * FROM " + this.quotedTableName() + " WHERE JSON_VALUE([data],'$.key')=@1";
    let params = [ key ];

    let request = this.createRequest(params);
    request.query(query, (err, result) => {
      err = err || null;

      let item = result && result.recordset ? result.recordset[0] || null : null; 

      if (item == null)
        this._logger.trace(correlationId, "Nothing found from %s with key = %s", this._tableName, key);
      else
        this._logger.trace(correlationId, "Retrieved from %s with key = %s", this._tableName, key);

      item = this.convertToPublic(item);
      callback(err, item);
    });
  }

}
```

Configuration for your microservice that includes sqlserver persistence may look the following way.

```yaml
...
{{#if SQLSERVER_ENABLED}}
- descriptor: pip-services:connection:sqlserver:con1:1.0
  table: {{SQLSERVER_TABLE}}{{#unless SQLSERVER_TABLE}}myobjects{{/unless}}
  connection:
    uri: {{{SQLSERVER_SERVICE_URI}}}
    host: {{{SQLSERVER_SERVICE_HOST}}}{{#unless SQLSERVER_SERVICE_HOST}}localhost{{/unless}}
    port: {{SQLSERVER_SERVICE_PORT}}{{#unless SQLSERVER_SERVICE_PORT}}1433{{/unless}}
    database: {{SQLSERVER_DB}}{{#unless SQLSERVER_DB}}app{{/unless}}
  credential:
    username: {{SQLSERVER_USER}}
    password: {{SQLSERVER_PASS}}
    
- descriptor: myservice:persistence:sqlserver:default:1.0
  dependencies:
    connection: pip-services:connection:sqlserver:con1:1.0
{{/if}}
...
```

## Develop

For development you shall install the following prerequisites:
* Node.js 8+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The library is created and maintained by **Sergey Seroukhov**.

The documentation is written by **Mark Makarychev**.
