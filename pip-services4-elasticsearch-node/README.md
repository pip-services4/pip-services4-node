# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> ElasticSearch components for Pip.Services in Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The Elasticsearch module contains logging components with data storage on the Elasticsearch server.

The module contains the following packages:
- **Build** - contains a factory for the construction of components
- **Log** - Logging components

<a name="links"></a> Quick links:

* [Configuration](http://docs.pipservices.org/toolkit/getting_started/configurations/)
* [Virtual memory configuration](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html)
* [API Reference](https://pip-services4-node.github.io/pip-services4-elasticsearch-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services-elasticsearch-node --save
```

Microservice components shall perform logging usual way using CompositeLogger component.
The CompositeLogger will get ElasticSearchLogger from references and will redirect log messages
there among other destinations.

```typescript
import { ConfigParams } from 'pip-services4-commons-node'; 
import { IConfigurable } from 'pip-services4-commons-node'; 
import { IReferences } from 'pip-services4-commons-node'; 
import { IReferenceable } from 'pip-services4-commons-node'; 
import { CompositeLogger } from 'pip-services4-components-node'; 

export class MyComponent implements IConfigurable, IReferenceable {
  private _logger: CompositeLogger = new CompositeLogger();
  
  public configure(config: ConfigParams): void {
    this._logger.configure(config);
  }
  
  public setReferences(refs: IReferences): void {
    this._logger.setReferences(refs);
  }
  
  public myMethod(context: IContext, param1: any, callback: (err: any, result: any) => void): void {
    this._logger.trace(context, "Executed method mycomponent.mymethod");
    ....
  }
}
```

Configuration for your microservice that includes ElasticSearch logger may look the following way.

```yaml
...
{{#if ELASTICSEARCH_ENABLED}}
- descriptor: pip-services:logger:elasticsearch:default:1.0
  connection:
    uri: {{{ELASTICSEARCG_SERVICE_URI}}}
    host: {{{ELASTICSEARCH_SERVICE_HOST}}}{{#unless ELASTICSEARCH_SERVICE_HOST}}localhost{{/unless}}
    port: {{ELASTICSEARCG_SERVICE_PORT}}{{#unless ELASTICSEARCH_SERVICE_PORT}}9200{{/unless}}\ 
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

Configure the vm.max_map_count

`sudo sysctl -w vm.max_map_count=262144`

    fixes:
    max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]

## Typed vs Type-less indexes
ES version 7 [stopped supporting "types"](https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html) and encouraged a separation of disperate data into different indexes. By default, this version of pip-services4-elasticsearch-node will support 7.x type-less indexes. You can support to the 6.x "typed" approach by setting the `include_type_name` option to true. This allows it to work with either 6.x or 7.x ElasticSearch servers.

You can read more about how this is accomplished  [here](https://www.elastic.co/blog/moving-from-types-to-typeless-apis-in-elasticsearch-7-0)

## Contacts

The library is created and maintained by **Sergey Seroukhov** and **Danil Prisyazhniy**.

The documentation is written by:
- **Mark Makarychev**


