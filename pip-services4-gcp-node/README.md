# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Controllers Logo" width="200"> <br/> Google Cloud specific components for Node.js / ES2017

This module is a part of the [Pip.Controllers](http://pipcontrollers.org) polyglot microcontrollers toolkit.

This module contains components for supporting work with the Google cloud platform.

The module contains the following packages:
- **Clients** - client components for working with Google Cloud Platform
- **Connect** - components of installation and connection settings
- **Container** - components for creating containers for Google server-side functions
- **Controllers** - contains interfaces and classes used to create Google controllers


<a name="links"></a> Quick links:

* [Configuration](http://docs.pipcontrollers.org/conceptual/configuration/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-gcp-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipcontrollers.org/get_help/)
* [Contribute](http://docs.pipcontrollers.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-gcp-node --save
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

The Node.js version of Pip.Controllers is created and maintained by
- **Sergey Seroukhov**
- **Danil Prisiazhnyi**
