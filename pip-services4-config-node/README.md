# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Config Components for Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The Config module contains configuration component definitions that can be used to build applications and services.

The module contains the following packages:
- **Auth** - authentication credential stores
- **Config** - configuration readers and managers, whose main task is to deliver configuration parameters to the application from wherever they are being stored
- **Connect** - connection discovery and configuration services

<a name="links"></a> Quick links:

* [Configuration](http://docs.pipservices.org/concepts/configuration/component_configuration/) 
* [API Reference](https://pip-services4-node.github.io/pip-services4-config-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-config-node --save
```

Example how to get connection parameters and credentials using resolvers.
The resolvers support "discovery_key" and "store_key" configuration parameters
to retrieve configuration from discovery services and credential stores respectively.

```typescript
import { ConfigParams } from 'pip-services4-commons-node'; 
import { IConfigurable } from 'pip-services4-commons-node'; 
import { IReferences } from 'pip-services4-commons-node'; 
import { IReferenceable } from 'pip-services4-commons-node'; 
import { IOpenable } from 'pip-services4-commons-node'; 
import { ConnectionParams } from 'pip-services4-config-node'; 
import { ConnectionResolver } from 'pip-services4-config-node'; 
import { CredentialParams } from 'pip-services4-config-node'; 
import { CredentialResolver } from 'pip-services4-config-node'; 

export class MyComponent implements IConfigurable, IReferenceable, IOpenable {
  private _connectionResolver: ConnectionResolver = new ConnectionResolver();
  private _credentialResolver: CredentialResolver = new CredentialResolver();
  
  public configure(config: ConfigParams): void {
    this._connectionResolver.configure(config);
    this._credentialResolver.configure(config);
  }
  
  public setReferences(refs: IReferences): void {
    this._connectionResolver.setReferences(refs);
    this._credentialResolver.setReferences(refs);
  }
  
  ...
  
  public async open(correlationId: string): Promise<void> {
    let connection = await this._connectionResolver.resolve(correlationId);
    let credential = await this._credentialResolver.lookup(correlationId);

    let host = connection.getHost();
    let port = connection.getPort();
    let user = credential.getUsername();
    let pass = credential.getPassword();
  }
}

// Using the component
let myComponent = new MyComponent();

myComponent.configure(ConfigParams.fromTuples(
  'connection.host', 'localhost',
  'connection.port', 1234,
  'credential.username', 'anonymous',
  'credential.password', 'pass123'
));

await myComponent.open(null);
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
