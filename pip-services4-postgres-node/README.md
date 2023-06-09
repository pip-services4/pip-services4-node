# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> PostgreSQL components for Pip.Services in Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit. It provides a set of components to implement PostgreSQL persistence.

The module contains the following packages:
- **Build** - Factory to create PostreSQL persistence components.
- **Connect** - Connection component to configure PostgreSQL connection to database.
- **Persistence** - abstract persistence components to perform basic CRUD operations.

<a name="links"></a> Quick links:

* [Configuration](https://www.pipservices.org/recipies/configuration)
* [API Reference](https://pip-services4-node.github.io/pip-services4-postgres-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)

## Use

Install the NPM package as
```bash
npm install pip-services4-postgres-node --save
```

As an example, lets create persistence for the following data object.

```dart
import 'package:pip_services3_commons/pip_services3_commons.dart';

class MyObject implements IStringIdentifiable, ICloneable {
  @override
  String? id;
  String? key;
  String? content;

  MyObject();

  MyObject.from(this.id, this.key, this.content);

  Map<String, dynamic> toJson() {
    return <String, dynamic>{'id': id, 'key': key, 'content': content};
  }

  void fromJson(Map<String, dynamic> json) {
    id = json['id'];
    key = json['key'];
    content = json['content'];
  }

  @override
  MyObject clone() {
    return MyObject.from(id, key, content);
  }
}
```

The persistence component shall implement the following interface with a basic set of CRUD operations.

```typescript
export interface IMyPersistence {
  getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams):  Promise<DataPage<MyObject>>;
    
  getOneById(context: IContext, id: string,): Promise<MyObject>;
    
  getOneByKey(context: IContext, key: string): Promise<MyObject>;
    
  create(context: IContext, item: MyObject): Promise<MyObject>;
    
  update(context: IContext, item: MyObject): Promise<MyObject>;
    
  deleteById(context: IContext, id: string): Promise<MyObject>;
}
```

To implement postgresql persistence component you shall inherit `IdentifiablePostgresPersistence`. 
Most CRUD operations will come from the base class. You only need to override `getPageByFilter` method with a custom filter function.
And implement a `getOneByKey` custom persistence method that doesn't exist in the base class.

```typescript
import { IdentifiablePostgresPersistence } from 'pip-services4-postgres-node';

export class MyPostgresPersistence extends IdentifiablePostgresPersistence {
  public constructor() {
    super("myobjects");
    this.autoCreateObject("CREATE TABLE myobjects (id VARCHAR(32) PRIMARY KEY, key VARCHAR(50), value VARCHAR(255)");
    this.ensureIndex("myobjects_key", { key: 1 }, { unique: true });
  }

  private composeFilter(filter: FilterParams): any {
    filter = filter || new FilterParams();
    
    let criteria = [];

    let id = filter.getAsNullableString('id');
    if (id != null)
        criteria.push("id='" + id + "'");

    let tempIds = filter.getAsNullableString("ids");
    if (tempIds != null) {
        let ids = tempIds.split(",");
        filters.push("id IN ('" + ids.join("','") + "')");
    }

    let key = filter.getAsNullableString("key");
    if (key != null)
        criteria.push("key='" + key + "'");

    return criteria.length > 0 ? criteria.join(" AND ") : null;
  }
  
  public getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<MyObject>> {
    return super.getPageByFilter(context, this.composeFilter(filter), paging, "id", null);
  }  
  
  public getOneByKey(context: IContext, key: string): Promise<MyObject> {
    let query = "SELECT * FROM " + this.quotedTableName() + " WHERE \"key\"=$1";
    let params = [ key ];

    return new Promise((resolve, reject) => {
      this._client.query(query, params, (err, result) => {
        if (err != null) {
          reject(err);
          return;
        }

        let item = result && result.rows ? result.rows[0] || null : null; 

        if (item == null)
          this._logger.trace(context, "Nothing found from %s with key = %s", this._tableName, key);
        else
          this._logger.trace(context, "Retrieved from %s with key = %s", this._tableName, key);

        item = this.convertToPublic(item);
        resolve(item);
      });
    });
  }

}
```

Alternatively you can store data in non-relational format using `IdentificableJsonPostgresPersistence`.
It stores data in tables with two columns - `id` with unique object id and `data` with object data serialized as JSON.
To access data fields you shall use `data->'field'` expression or `data->>'field'` expression for string values.

```typescript
import 'package:pip_services3_postgres/pip_services3_postgres_dart.dart';

class MyPostgresJsonPersistence
    extends IdentifiableJsonPostgresPersistence<MyObject, String> {
  MyPostgresJsonPersistence() : super('myobjects', null) {
    ensureTable_(idType: "VARCHAR(32)", dataType: "JSONB");
    ensureIndex_("myobjects_key", {"data->>'key'": 1}, {'unique': true});
  }

  String? _composeFilter(FilterParams? filter) {
    filter = filter ?? FilterParams();

    var criteria = [];

    var id = filter.getAsNullableString('id');
    if (id != null) criteria.add("data->>'id'='" + id + "'");

    var tempIds = filter.getAsNullableString("ids");
    if (tempIds != null) {
      var ids = tempIds.split(",");
      criteria.add("data->>'id' IN ('" + ids.join("','") + "')");
    }

    var key = filter.getAsNullableString("key");
    if (key != null) criteria.add("data->>'key'='" + key + "'");

    return criteria.length > 0 ? criteria.join(" AND ") : null;
  }

  Future<DataPage<MyObject>> getPageByFilter(
      String? context, FilterParams? filter, PagingParams? paging) {
    return super.getPageByFilter_(
        context, _composeFilter(filter), paging, 'id', null);
  }

  Future<MyObject?> getOneByKey(String? context, String key) async {
    var query =
        "SELECT * FROM " + this.quotedTableName_() + " WHERE data->>'key'=@1";
    var params = {'1': key};

    var res = await client_!.query(query, substitutionValues: params);

    var resValues = res.isNotEmpty ? res.first[0][1] : null;

    var item = this.convertToPublic_(resValues);

    if (item == null)
      this.logger_.trace(context, "Nothing found from %s with key = %s",
          [this.tableName_, key]);
    else
      this.logger_.trace(context, "Retrieved from %s with key = %s",
          [this.tableName_, key]);

    item = this.convertToPublic_(item);
    return item;
  }
}
```

Configuration for your microservice that includes postgresql persistence may look the following way.

```yaml
...
{{#if POSTGRES_ENABLED}}
- descriptor: pip-services:connection:postgres:con1:1.0
  connection:
    uri: {{{POSTGRES_SERVICE_URI}}}
    host: {{{POSTGRES_SERVICE_HOST}}}{{#unless POSTGRES_SERVICE_HOST}}localhost{{/unless}}
    port: {{POSTGRES_SERVICE_PORT}}{{#unless POSTGRES_SERVICE_PORT}}5432{{/unless}}
    database: {{POSTGRES_DB}}{{#unless POSTGRES_DB}}app{{/unless}}
  credential:
    username: {{POSTGRES_USER}}
    password: {{POSTGRES_PASS}}
    
- descriptor: myservice:persistence:postgres:default:1.0
  dependencies:
    connection: pip-services:connection:postgres:con1:1.0
  table: {{POSTGRES_TABLE}}{{#unless POSTGRES_TABLE}}myobjects{{/unless}}
{{/if}}
...
```

## Develop

For development you shall install the following prerequisites:
* Node.js 14+
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

The library is created and maintained by **Sergey Seroukhov** and **Danil Prisyazhniy**.

The documentation is written by **Mark Makarychev** and **Eugenio Andrieu**.
