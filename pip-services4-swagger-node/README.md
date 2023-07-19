# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Swagger UI for HTTP/REST Communication Components in Node.js / ES2017

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The swagger module provides a Swagger UI that can be added into microservices and seamlessly integrated with existing REST and Commandable HTTP services.

The module contains the following packages:
- **Build** - Swagger service factory
- **Services** - Swagger UI service

<a name="links"></a> Quick links:

* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)


## Use

Install the NPM package as
```bash
npm install pip-services4-swagger-node --save
```

Develop a RESTful service component. For example, it may look the following way.
In the `register` method we load an Open API specification for the controller.
You can also enable swagger by default in the constractor by setting `_swaggerEnable` property.
```typescript
export class MyRestController extends RestController {
    public constructor() {
        super();
        this._baseRoute = "myservice";
        this._swaggerEnable = true;
    }

    private greeting(req, res) {
        let name = req.params.name;
        let response = "Hello, " + name + "!";
        this.sendResult(req, res, response);
    }
        
    public register() {
        this.registerRoute(
            'get', '/greeting', 
            new ObjectSchema(true)
                .withRequiredProperty("name", TypeCode.String),
            this.greeting
        );
        
        this.registerOpenApiSpecFromFile('./src/controllers/mycontroller.yml');
    }
}
```

The Open API specification for the controller shall be prepared either manually
or using [Swagger Editor](https://editor.swagger.io/)
```yaml
openapi: '3.0.2'
info:
  title: 'MyService'
  description: 'MyService REST API'
  version: '1'
paths:
  /myservice/greeting:
    get:
      tags:
        - myservice
      operationId: 'greeting'
      parameters:
      - name: trace_id
        in: query
        description: Trace ID
        required: false
        schema:
          type: string
      - name: name
        in: query
        description: Name of a person
        required: true
        schema:
          type: string
      responses:
        200:
          description: 'Successful response'
          content:
            application/json:
              schema:
                type: 'string'
```

Include Swagger service into `config.yml` file and enable swagger for your REST or Commandable HTTP controllers.
Also explicitely adding HttpEndpoint allows to share the same port between REST controllers and the Swagger controller.
```yaml
---
...
# Shared HTTP Endpoint
- descriptor: "pip-services:endpoint:http:default:1.0"
  connection:
    protocol: http
    host: localhost
    port: 8080

# Swagger Controller
- descriptor: "pip-services:swagger-controller:http:default:1.0"

# My RESTful Controller
- descriptor: "myservice:service:rest:default:1.0"
  swagger:
    enable: true
```

Finally, remember to add factories to your container, to allow it creating required components.
```typescript
...
import { DefaultRpcFactory } from 'pip-services4-rpc-node';
import { DefaultSwaggerFactory } from 'pip-services4-swagger-node';

export class MyProcess extends ProcessContainer {
  public constructor() {
    super("myservice", "MyService microservice");
    
    this._factories.add(new DefaultHttpFactory());
    this._factories.add(new DefaultSwaggerFactory());
    this._factories.add(new MyServiceFactory());
    ...
  }
}
```

Launch the microservice and open the browser to open the Open API specification at
[http://localhost:8080/greeting/swagger](http://localhost:8080/greeting/swagger)

Then open the Swagger UI using the link [http://localhost:8080/swagger](http://localhost:8080/swagger).
The result shall look similar to the picture below.

<img src="swagger-ui.png"/>

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
- **Sergey Seroukhov**
- **Danil Prisyazhiy**
