# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Data Handling Components for Node.js

This module is a part of the [Pip.Services](http://pip.services.org) polyglot microservices toolkit.

It dynamic and static objects and data handling components.

The module contains the following packages:
- **Data** - data patterns
- **Keys**- object key (id) generators
- **Process**- data processing components
- **Query**- data query objects
- **Random** - random data generators
- **Validate** - validation patterns

<a name="links"></a> Quick links:

* [Data Patterns](http://docs.pipservices.org/toolkit/recipes/memory_persistence/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-data-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-data-node --save
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

The module is created and maintained by **Sergey Seroukhov** and **Danil Prisyazhniy**.

The documentation is written by:
- **Egor Nuzhnykh**
- **Alexey Dvoykin**
- **Mark Makarychev**
- **Eugenio Andrieu**