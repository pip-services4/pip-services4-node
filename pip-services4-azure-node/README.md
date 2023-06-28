# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Azure specific components for Node.js / ES2017

This module is a part of the [Pip.Services](http://pip.services.org) polyglot microservices toolkit.

Contains packages used to create containers and services that do operations via the Azure Function protocol.

The module contains the following packages:
- **Clients** - client components for working with Azure cloud Functions.
- **Connect** - components for installation and connection settings.
- **Containers** - contains classes that act as containers to instantiate and run components.
- **Controllers** - contains interfaces and classes used to create controllers that do operations via the Azure Function protocol.

<a name="links"></a> Quick links:

* [Configuration](http://docs.pipservices.org/conceptual/configuration/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-azue-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-azure-node --save
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

The Node.js version of Pip.Services is created and maintained by 
- **Sergey Seroukhov**
- **Dmitrij Uzdemir**

