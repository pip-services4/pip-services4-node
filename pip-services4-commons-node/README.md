# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Portable Abstractions and Patterns for Node.js

This module is a part of the [Pip.Services](http://pip.services.org) polyglot microservices toolkit.
It provides a set of basic patterns used in microservices or backend services.
Also the module implemenets a reasonably thin abstraction layer over most fundamental functions across
all languages supported by the toolkit to facilitate symmetric implementation.

The module contains the following packages:
- **Commands** - commanding and eventing patterns
- **Config** - configuration pattern
- **Convert** - portable value converters
- **Data** - data patterns
- **Errors**- application errors
- **Random** - random data generators
- **Refer** - locator inversion of control (IoC) pattern
- **Reflect** - portable reflection utilities
- **Run** - component life-cycle management patterns
- **Validate** - validation patterns

<a name="links"></a> Quick links:

* [Configuration Pattern](http://docs.pipservices.org/toolkit/getting_started/configurations/) 
* [Locator Pattern](http://docs.pipservices.org/toolkit/recipes/component_references/)
* [Component Lifecycle](http://docs.pipservices.org/toolkit/recipes/component_lifecycle/)
* [Data Patterns](http://docs.pipservices.org/toolkit/recipes/memory_persistence/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-commons-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-commons-node --save
```

Then you are ready to start using the Pip.Services patterns to augment your backend code.

For instance, here is how you can implement a component, that receives configuration, get assigned references,
can be opened and closed using the patterns from this module.

```typescript
import { IConfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';

export class MyComponentA implements IConfigurable, IReferenceable, IOpenable {
    private _param1: string = "ABC";
    private _param2: number = 123;
    private _anotherComponent: MyComponentB;
    private _opened: boolean = true;

    public configure(config: ConfigParams): void {
        this._param1 = config.getAsStringWithDefault("param1", this._param1);
        this._param2 = config.getAsIntegerWithDefault("param2", this._param2);
    }

    public setReferences(refs: IReferences): void {
        this._anotherComponent = refs.getOneRequired<MyComponentB>(
            new Descriptor("myservice", "mycomponent-b", "*", "*", "1.0")
        );
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        this._opened = true;
        console.log("MyComponentA has been opened.");
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        this._opened = true;
        console.log("MyComponentA has been closed.");
        callback(null);
    }

}
```

Then here is how the component can be used in the code

```typescript
import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';

let myComponentA = new MyComponentA();

// Configure the component
myComponentA.configure(ConfigParams.fromTuples(
  'param1', 'XYZ',
  'param2', 987
));

// Set references to the component
myComponentA.setReferences(References.fromTuples(
  new Descriptor("myservice", "mycomponent-b", "default", "default", "1.0",) myComponentB
));

// Open the component
myComponentA.open("123", (err) => {
   console.log("MyComponentA has been opened.");
   ...
});
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

The module is created and maintained by **Sergey Seroukhov**.

The documentation is written by **Egor Nuzhnykh**, **Alexey Dvoykin**, **Mark Makarychev**.
