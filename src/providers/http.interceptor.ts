namespace App
{
    let ng = angular.module('MyApp');

    export const BearerInterceptor: angular.IHttpInterceptor = {
        request: (config) => {
            let authSrv = angular.injector(['AuthServiceModule']).get<any>('AuthService');
            if (authSrv.isLogedIn())
            {
                config.headers['Authorization'] = 'Bearer randomstring';
            }
            return config;
        }
    };

    function BearerFn(httpProvider: angular.IHttpProvider) {
        httpProvider.interceptors.push(() => BearerInterceptor);
    }
    
    BearerFn.$inject = ['$httpProvider'];
    ng.config(BearerFn);
}