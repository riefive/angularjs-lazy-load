namespace App 
{
    let ng = angular.module('MyApp');

    export class LazyService implements angular.IServiceProvider 
    {
        public promisesCache = {};
        private static singleton: LazyService;
        private http: angular.IHttpService;

        constructor() 
        {
            this.http = angular.injector(['ng']).get('$http');
        }

        public loadComponent(name: string, path: string = '') 
        {
            path = (path == name) ? name : path;
            var path = `components/${path}/${name}.component.js`;
            let promise = this.loadScript(`${path}`);
            return promise;
        }

        public loadScript(path: string) 
        {
            path = `${config.jsPath}/${path}`;
            var promise: angular.IHttpPromise<any>|null = this.promisesCache[path];
            
            if (!promise) {
                promise = this.http.get<any>(path);
                this.promisesCache[path] = promise;
                return promise.then(function(result) {
                    // Not sure if this is really secure...
                    // But RequireJS done the same... 
                    eval(result.data);
                    console.log('Loaded: ' + path);
                });
            }
            return promise;
        }

        public loadService(name: string) 
        {
            return this.loadScript(`services/${name}.service.js`);
        }

        public resolve(
            controllerName: string, 
            controllerFileName: string,
            services: Array<string> = [], 
            customRouteProperties: any = {},
            controllerPath: string = '',
            controllerAlias: string = 'vm')
        {
            controllerPath = (controllerPath == '') ? controllerFileName : controllerPath;

            var resolveObj = {
                ctrl: ['lazyService', (srv: LazyService) => {
                    return srv.loadComponent(controllerFileName, controllerPath);
                }]
            };

            services.forEach(s => {
                resolveObj[s] = ['lazyService', (srv: LazyService) => {
                    return srv.loadService(s);
                }]
            });

            var res = {
                templateUrl: `${config.templatePath}/${controllerPath}/${controllerFileName}.component.html`,
                controller: `${controllerName} as ${controllerAlias}`,
                resolve: resolveObj
            };

            return { ...res, ...customRouteProperties}; // Merge custom Properties
        }

        public static Singleton()
        {
            if (LazyService.singleton == null) LazyService.singleton = new LazyService();
            return LazyService.singleton;
        }

        $get() {
            return LazyService.Singleton();
        }
    }

    ng.provider('lazyServiceProvider', LazyService);
    ng.factory('lazyService', LazyService.Singleton);
}
