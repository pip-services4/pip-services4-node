# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Observability Components for Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The Observability module contains observability component definitions that can be used to build applications and services.

The module contains the following packages:
- **Count** - performance counters
- **Log** - basic logging components that provide console and composite logging, as well as an interface for developing custom loggers
- **Trace** - tracing components
- **Component** - the root package

<a name="links"></a> Quick links:

* [Logging](http://docs.pipservices.org/getting_started/recipes/logging/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-observability-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-observability-node --save
```

Example how to use Logging and Performance counters.
Here we are going to use CompositeLogger and CompositeCounters components.
They will pass through calls to loggers and counters that are set in references.

```typescript
import { ConfigParams } from 'pip-services4-commons-node'; 
import { IConfigurable } from 'pip-services4-commons-node'; 
import { IReferences } from 'pip-services4-commons-node'; 
import { IReferenceable } from 'pip-services4-commons-node'; 
import { CompositeLogger } from 'pip-services4-observability-node'; 
import { CompositeCounters } from 'pip-services4-observability-node'; 

export class MyComponent implements IConfigurable, IReferenceable {
  private _logger: CompositeLogger = new CompositeLogger();
  private _counters: CompositeCounters = new CompositeCounters();
  
  public configure(config: ConfigParams): void {
    this._logger.configure(config);
  }
  
  public setReferences(refs: IReferences): void {
    this._logger.setReferences(refs);
    this._counters.setReferences(refs);
  }
  
  public async myMethod(context: IContext, param1: any): Promise<void> {
    this._logger.trace(context, "Executed method mycomponent.mymethod");
    this._counters.increment("mycomponent.mymethod.exec_count", 1);
    let timing = this._counters.beginTiming("mycomponent.mymethod.exec_time");
    try {
      ....
    } finally {
      timing.endTiming();
    } catch (err) {
      if (err) {
        this._logger.error(context, err, "Failed to execute mycomponent.mymethod");
        this._counters.increment("mycomponent.mymethod.error_count", 1);
      }
    }
    ...
  }
}
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
