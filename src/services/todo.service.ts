/// <reference path='../interfaces/todo.interface.ts' />

namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class TodoService 
    {
        constructor(private http: angular.IHttpService, private q: angular.IQService)
        {
        }

        GetAll()
        {
            const result = this.http.get<Todo[]>(`${config.apiURL}/todos`)
            return result;
        }

        GetOne(id: number)
        {
            const result = this.http.get<Todo>(`${config.apiURL}/todos/${id}`);
            return result;
        }

        GetByParams(filters: { page: number, limit: number } | any = null) {
            let params: any
            if (filters) 
            {
                params = new URLSearchParams({ _page: filters.page, _limit: filters.limit })
            }  
            const paramsString = params ? `?${params.toString()}` : ''
            const result = this.http.get<Todo[]>(`${config.apiURL}/todos`.concat(paramsString));
            return result;
        }

        static Factory(http: angular.IHttpService, q: angular.IQService)
        {
            return new TodoService(http, q);
        }
    }

    TodoService.Factory.$inject = ['$http', '$q'];
    ng.factory('TodoService', TodoService.Factory);
}