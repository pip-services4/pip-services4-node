# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Business Logic Components for Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The Logic module contains standard component definitions to handle complex business transactions.

The module contains the following packages:
- **Cache** - distributed cache
- **Lock** -  distributed lock components
- **State** -  distributed state management components

<a name="links"></a> Quick links:

* [Logging](http://docs.pipservices.org/getting_started/recipes/logging/)
* [Configuration](http://docs.pipservices.org/concepts/configuration/component_configuration/) 
* [API Reference](https://pip-services4-node.github.io/pip-services4-logic-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-logic-node --save
```

Example how to use caching and locking.
Here we assume that references are passed externally.

```typescript
import { Descriptor } from 'pip-services4-commons-node'; 
import { References } from 'pip-services4-commons-node'; 
import { IReferences } from 'pip-services4-commons-node'; 
import { IReferenceable } from 'pip-services4-commons-node'; 
import { ILock } from 'pip-services4-logic-node'; 
import { MemoryLock } from 'pip-services4-logic-node'; 
import { ICache } from 'pip-services4-logic-node'; 
import { MemoryCache } from 'pip-services4-logic-node'; 

export class MyComponent implements IReferenceable {
  private _cache: ICache;
  private _lock: ILock;
  
  public setReferences(refs: IReferences): void {
    this._cache = refs.getOneRequired<ICache>(new Descriptor("*", "cache", "*", "*", "1.0"));
    this._lock = refs.getOneRequired<ILock>(new Descriptor("*", "lock", "*", "*", "1.0"));
  }
  
  public async myMethod(correlationId: string, param1: any): Promise<any> {
    // First check cache for result
    result := await this._cache.retrieve(correlationId, "mykey");
    if (result != null) {
      return result;
    }
      
    // Lock..
    await this._lock.acquireLock(correlationId, "mykey", 1000, 1000);
    
    // Do processing
    ...
    
    // Store result to cache async
    this._cache.store(correlationId, "mykey", result, 3600000);

    // Release lock async
    this._lock.releaseLock(correlationId, "mykey");

    return result;
  }
}

// Use the component
let myComponent = new MyComponent();

myComponent.setReferences(References.fromTuples(
  new Descriptor("pip-services", "cache", "memory", "default", "1.0"), new MemoryCache(),
  new Descriptor("pip-services", "lock", "memory", "default", "1.0"), new MemoryLock(),
);

result := await myComponent.myMethod(null);
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
