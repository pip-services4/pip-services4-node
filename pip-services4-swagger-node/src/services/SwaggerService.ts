const fs = require('fs');
const path = require('path');

import { ISwaggerService } from 'pip-services4-rpc-node';
import { RestService } from 'pip-services4-rpc-node';

export class SwaggerService extends RestService implements ISwaggerService {
    private _routes: any = {};

    public constructor() {
        super();
        this._baseRoute = 'swagger';
    }

    private calculateFilePath(fileName: string): string {
        return __dirname + '/../../../src/swagger-ui/' + fileName;
    }

    private calculateContentType(fileName: string): string {
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

    private checkFileExist(fileName: string): boolean {
        let path = this.calculateFilePath(fileName);
        return fs.existsSync(path);
    }

    private loadFileContent(fileName: string): string {
        let path = this.calculateFilePath(fileName);
        return fs.readFileSync(path, 'utf-8');
    }

    private getSwaggerFile(req: any, res: any): void {
        let fileName = req.params.file_name.toLowerCase();

        if (!this.checkFileExist(fileName)) {
            res.status(404);
            return;
        }

        res.header('Content-Type', this.calculateContentType(fileName));
        let content = this.loadFileContent(fileName);
        res.sendRaw(content);
    }

    private getIndex(req: any, res: any): void {
        let content = this.loadFileContent('index.html');

        // Inject urls
        let urls: any[] = [];
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

    private redirectToIndex(req: any, res: any): void {
        let url = req.url;
        if (!url.endsWith('/')) url = url + '/';
        res.redirect(301, url + 'index.html', () => {});
    }

    private composeSwaggerRoute(baseRoute: string, route: string): string {
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

    public registerOpenApiSpec(baseRoute: string, swaggerRoute?: string): void {
        if (swaggerRoute == null)
            super.registerOpenApiSpec(baseRoute);
        else {
            let route = this.composeSwaggerRoute(baseRoute, swaggerRoute);
            baseRoute = baseRoute || "default";
            this._routes[baseRoute] = route;
        }
    }

    public register() {
        // A hack to redirect default base route
        let baseRoute = this._baseRoute;
        this._baseRoute = null;
        this.registerRoute(
            'get', baseRoute, null, this.redirectToIndex
        );
        this._baseRoute = baseRoute;

        this.registerRoute(
            'get', '/', null, this.redirectToIndex
        );

        this.registerRoute(
            'get', '/index.html', null, this.getIndex
        );

        this.registerRoute(
            'get', '/:file_name', null, this.getSwaggerFile
        );
    }
}