namespace App 
{
    interface IAuthService
    {
        login(user: string, pass: string): angular.IHttpPromise<any>;
        logout(): angular.IHttpPromise<any>;
        isLogedIn(): boolean;
        getUser(): string;
        roles(): Array<string>;
    }

    interface IAuthServiceProvider extends angular.IServiceProvider
    {
        $get(): AuthService;
    }

    export class AuthService implements IAuthService
    {
        static singleton: AuthService;
        private user: string = '';
        private userRoles: string[] = [];

        constructor(
            private http: angular.IHttpService, 
            private cookie: angular.cookies.ICookiesService
        ) 
        {
            if (this.cookie.get('user') != null)
            {
                this.user = cookie.get('user');
                this.userRoles = JSON.parse(cookie.get('role'));
            }
        }

        login(user: string, pass: string): angular.IHttpPromise<any>
        {
            return this.http.post(`${config.apiURL}/users`, {user, pass}).then<any>((d) => {
                this.setUser(user);
                let role = [user];
                this.setRoles(role);

                let date = new Date();
                date.setMonth(date.getMonth() + 1);
                this.cookie.put('user', user, { expires: date });
                this.cookie.put('role', JSON.stringify(role), { expires: date });
                return d;
            });
        }

        logout(): angular.IHttpPromise<any> 
        {
            let user = this.user;
            return this.http.post(`${config.apiURL}/users`, {user}).then<any>((d) => {
                this.setUser('');
                this.cookie.remove('user');
                this.cookie.remove('role');
                return d;
            });
        }

        private setUser(user: string): void 
        {
            this.user = user;
        }

        private setRoles(role: string[]): void 
        {
            this.userRoles = role;
        }
        
        isLogedIn(): boolean 
        {
            return this.user.length > 0;
        }

        getUser() 
        { 
            return this.user; 
        }

        roles(): string[] {
            return this.userRoles;
        }

        hasRole(role: string) : boolean
        {
            return this.userRoles.filter(f => f == role).length > 0;
        }

        static Factory = (http: angular.IHttpService, cookie: angular.cookies.ICookiesService) => 
        { 
            if (AuthService.singleton == null)
                AuthService.singleton = new AuthService(http, cookie);
            return AuthService.singleton;
        }
    }

    class AuthServiceProvider implements angular.IServiceProvider 
    {
        $get = AuthService.Factory;
    }

    AuthService.Factory.$inject = ['$http', '$cookies'];

    let ng = angular.module('AuthServiceModule', ['ngCookies']);
    ng.factory('AuthService', AuthService.Factory);
    ng.provider('AuthServiceProvider', AuthServiceProvider);
}