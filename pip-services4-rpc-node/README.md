# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Synchonous Communication Components in Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The rpc module provides the synchronous communication compoents. It contains both server and client side implementations.

The module contains the following packages:
- **Clients** - mechanisms for retrieving connection settings from the microservice’s configuration and providing clients and services with these settings
- **Commands** - commanding and eventing patterns
- **Trace** - logging and tracing utilities

<a name="links"></a> Quick links:

* [Your first microservice in Node.js](http://docs.pipservices.org/toolkit/getting_started/your_first_microservice/) 
* [Data Microservice. Step 5](http://docs.pipservices.org/toolkit/tutorials/data_microservice/step5/)
* [Microservice Facade](http://docs.pipservices.org/toolkit/tutorials/microservice_facade/) 
* [Client Library. Step 3](http://docs.pipservices.org/toolkit/tutorials/client_library/step2/)
* [Client Library. Step 4](http://docs.pipservices.org/toolkit/tutorials/client_library/step3/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-rpc-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)


## Use

Install the NPM package as
```bash
npm install pip-services4-rpc-node --save
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

The Node.js version of Pip.Services is created and maintained by:
- **Volodymyr Tkachenko**
- **Sergey Seroukhov**
- **Mark Zontak**
- **Danil Prisyazhniy**

The documentation is written by:
- **Mark Makarychev**
- **Eugenio Andrieu**
