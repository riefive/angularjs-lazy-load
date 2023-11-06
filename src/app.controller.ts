/// <reference path='../node_modules/@types/angular/index.d.ts' />
/// <reference path='../node_modules/@types/angular/angular-component-router.d.ts' />
/// <reference path='./interfaces/auth.interface.ts' />
/// <reference path='./interfaces/lazy.interface.ts' />

namespace App 
{
    const mainName = 'MyApp'
    const ng = angular.module(mainName, ['ng', 'ngRoute', 'AuthServiceModule'])

    angular.module = (name, require, configFn) => {
        if (name == mainName) return ng;
        return angular.module(name, require, configFn);
    };

    export class AppController implements angular.IOnInit 
    {
        static $inject = ['$scope', '$rootScope', '$location', '$http', 'lazyService', 'AuthService']
        public title: string = ''
        public menuActive: string = 'home'
        public menus: any[] = [
            { id: 'home', icon: 'bi-house', text: 'Main', path: 'task-a' },
            { id: 'todo', icon: 'bi-grid', text: 'Todo List', path: 'todo' },
            { id: 'post', icon: 'bi-grid', text: 'Post List', path: 'post' },
            { id: 'user', icon: 'bi-people', text: 'User List', path: 'user' }
        ]

        constructor(
            private scope: angular.IScope,
            private rootScope: angular.IRootScopeService,
            private location: angular.ILocationService,
            private http: angular.IHttpService,
            private lazy: LazyService,
            private authSrv: AuthService
        )
        {
            // console.log(this.rootScope.$root)
        }

        $onInit(): void 
        {
            this.beforeEnterPage()
        }

        public beforeEnterPage()
        {
            this.scope.$on('$routeChangeStart', (
                angularEvent: angular.IAngularEvent, 
                newUrl?: angular.route.IRoute
            ) => 
            {
                if (newUrl == null) {
                    // workaround to get new path after changed... 
                    setTimeout(() => {throw new Error(`This route (${window.location.href}) doesn't exist!`)}, 500)
                    return;
                };

                let count = 0;
                let userRole = this.authSrv.roles();
                let routeRole: Array<any> = newUrl.roles ?? [];
                this.title = ''

                routeRole.forEach(r => {
                    if (userRole.filter(f => f == r).length > 0) count++;
                });

                let isError = false
                if (count < userRole.length && routeRole.length > 0)
                {
                    isError = true
                    this.location.path('/'); // User isn’t allowed to access the route
                }
                if (newUrl.requiredAuth && !this.authSrv.isLogedIn()) 
                {
                    isError = true
                    this.location.path('/'); // User isn’t authenticated
                }
                if (!isError)
                {
                    const titleCurrent = newUrl?.title || ''
                    this.title = titleCurrent
                }
            });
        }


        public isLoggedIn()
        {
            return this.authSrv.isLogedIn();
        }

        public logout()
        {
            this.authSrv.logout().then(d => {
                alert('User logged out');
            });
        }

        public doChangeMenu(id: string)
        {
            this.menuActive = id
        }
    }

    function RouterConfig(
        route: angular.route.IRouteProvider, 
        ctrl: angular.IControllerProvider, 
        prov: angular.auto.IProvideService,
        lz: LazyService
    )
    {
        lz = lz.$get();
        // This force adding/caching the old before bootstraped angular ... :/ 
        // @see https://stackoverflow.com/a/32061320/4906348
        (ng as any).lazy = {
            controller: ctrl.register,
            provider: prov.provider,
            factory: prov.factory,
            service: prov.service,
            config: ng.config,
            module: ng
        }

        route
            .when('/task-a', lz.resolve('taskAPage', 'task-a' , ['task-a']))
            .when('/task-b', lz.resolve('taskBPage', 'task-b' , ['task-b'], { requiredAuth: true }))
            .when('/task-c', lz.resolve('taskCPage', 'task-c' , ['task-c'], { requiredAuth: true, roles: ['admin'] }))
            .when('/post', lz.resolve('postPage', 'post' , ['post'], { requiredAuth: true, roles: ['admin'], title: 'Post List' }))
            .when('/todo', lz.resolve('todoPage', 'todo' , ['todo', 'task-c'], { requiredAuth: true, roles: ['admin'], title: 'Todo List' }))
            .when('/user', lz.resolve('userPage', 'user' , ['user'], { requiredAuth: true, roles: ['admin'], title: 'User List' }))
            .when('/login', lz.resolve('loginPage', 'login'))
    }

    RouterConfig.$inject = ['$routeProvider', '$controllerProvider', '$provide', 'lazyServiceProvider']

    ng.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);
    ng.config(RouterConfig);

    ng.controller('AppController', AppController);
}
