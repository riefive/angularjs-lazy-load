/// <reference path='../interfaces/user.interface.ts' />

namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class UserService 
    {
        constructor(private http: angular.IHttpService, private q: angular.IQService)
        {
        }

        GetAll()
        {
            const result = this.http.get<User[]>(`${config.apiURL}/users`)
            return result;
        }

        GetOne(id: number)
        {
            const result = this.http.get<User>(`${config.apiURL}/users/${id}`);
            return result;
        }

        GetByParams(filters: { page: number, limit: number } | any = null) {
            let params: any
            if (filters) 
            {
                params = new URLSearchParams({ _page: filters.page, _limit: filters.limit })
            }  
            const paramsString = params ? `?${params.toString()}` : ''
            const result = this.http.get<User[]>(`${config.apiURL}/users`.concat(paramsString));
            return result;
        }

        static Factory(http: angular.IHttpService, q: angular.IQService)
        {
            return new UserService(http, q);
        }
    }

    UserService.Factory.$inject = ['$http', '$q'];
    ng.factory('UserService', UserService.Factory);
}