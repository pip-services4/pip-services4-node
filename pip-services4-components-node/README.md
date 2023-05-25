# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Component definitions for Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The Components module contains standard component definitions that can be used to build applications and services.

The module contains the following packages:
- **Build** - basic factories for constructing objects
- **Info** - context info implementations that manage the saving of process information and sending additional parameter sets
- **Test** - minimal set of test components to make testing easier

<a name="links"></a> Quick links:

* [API Reference](https://pip-services4-node.github.io/pip-services4-components-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-components-node --save
```

If you need to create components using their locators (descriptors) implement 
component factories similar to the example below.

```typescript
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

export class MyFactory extends Factory {
  public static myComponentDescriptor: Descriptor = new Descriptor("myservice", "mycomponent", "default", "*", "1.0");
  
  public MyFactory() {
    super();
    
    this.registerAsType(MyFactory.myComponentDescriptor, MyComponent);    
  }
}

// Using the factory

let myFactory = MyFactory();

let myComponent1 = myFactory.create(new Descriptor("myservice", "mycomponent", "default", "myComponent1", "1.0");
let myComponent2 = myFactory.create(new Descriptor("myservice", "mycomponent", "default", "myComponent2", "1.0");

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
