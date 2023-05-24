"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerService = void 0;
const fs = require('fs');
const path = require('path');
const pip_services3_rpc_node_1 = require("pip-services4-rpc-node");
class SwaggerService extends pip_services3_rpc_node_1.RestService {
    constructor() {
        super();
        this._routes = {};
        this._baseRoute = 'swagger';
    }
    calculateFilePath(fileName) {
        return __dirname + '/../../../src/swagger-ui/' + fileName;
    }
    calculateContentType(fileName) {
        let ext = path.extname(fileName);
        switch (ext) {
            case '.html':
                return 'text/html';
            case '.css':
                return 'text/css';
            case '.js':
                return 'application/javascript';
            case '.png':
                return 'image/png';
            default:
                return 'text/plain';
        }
    }
    checkFileExist(fileName) {
        let path = this.calculateFilePath(fileName);
        return fs.existsSync(path);
    }
    loadFileContent(fileName) {
        let path = this.calculateFilePath(fileName);
        return fs.readFileSync(path, 'utf-8');
    }
    getSwaggerFile(req, res) {
        let fileName = req.params.file_name.toLowerCase();
        if (!this.checkFileExist(fileName)) {
            res.status(404);
            return;
        }
        res.header('Content-Type', this.calculateContentType(fileName));
        let content = this.loadFileContent(fileName);
        res.sendRaw(content);
    }
    getIndex(req, res) {
        let content = this.loadFileContent('index.html');
        // Inject urls
        let urls = [];
        for (let prop in this._routes) {
            let url = {
                name: prop,
                url: this._routes[prop]
            };
            urls.push(url);
        }
        content = content.replace('[/*urls*/]', JSON.stringify(urls));
        res.header('Content-Type', 'text/html');
        res.sendRaw(content);
    }
    redirectToIndex(req, res) {
        let url = req.url;
        if (!url.endsWith('/'))
            url = url + '/';
        res.redirect(301, url + 'index.html', () => { });
    }
    composeSwaggerRoute(baseRoute, route) {
        if (baseRoute != null && baseRoute != "") {
            if (route == null || route == "")
                route = "/";
            if (!route.startsWith("/"))
                route = "/" + route;
            if (!baseRoute.startsWith("/"))
                baseRoute = "/" + baseRoute;
            route = baseRoute + route;
        }
        return route;
    }
    registerOpenApiSpec(baseRoute, swaggerRoute) {
        if (swaggerRoute == null)
            super.registerOpenApiSpec(baseRoute);
        else {
            let route = this.composeSwaggerRoute(baseRoute, swaggerRoute);
            baseRoute = baseRoute || "default";
            this._routes[baseRoute] = route;
        }
    }
    register() {
        // A hack to redirect default base route
        let baseRoute = this._baseRoute;
        this._baseRoute = null;
        this.registerRoute('get', baseRoute, null, this.redirectToIndex);
        this._baseRoute = baseRoute;
        this.registerRoute('get', '/', null, this.redirectToIndex);
        this.registerRoute('get', '/index.html', null, this.getIndex);
        this.registerRoute('get', '/:file_name', null, this.getSwaggerFile);
    }
}
exports.SwaggerService = SwaggerService;
//# sourceMappingURL=SwaggerService.js.map