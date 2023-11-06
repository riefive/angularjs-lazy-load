/// <reference path='../interfaces/post.interface.ts' />

namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class PostService 
    {
        constructor(private http: angular.IHttpService, private q: angular.IQService)
        {
        }

        GetAll()
        {
            const result = this.http.get<Post[]>(`${config.apiURL}/posts`)
            return result;
        }

        GetOne(id: number)
        {
            const result = this.http.get<Post>(`${config.apiURL}/posts/${id}`);
            return result;
        }

        GetByParams(filters: { page: number, limit: number } | any = null) {
            let params: any
            if (filters) 
            {
                params = new URLSearchParams({ _page: filters.page, _limit: filters.limit })
            }  
            const paramsString = params ? `?${params.toString()}` : ''
            const result = this.http.get<Post[]>(`${config.apiURL}/posts`.concat(paramsString));
            return result;
        }

        static Factory(http: angular.IHttpService, q: angular.IQService)
        {
            return new PostService(http, q);
        }
    }

    PostService.Factory.$inject = ['$http', '$q'];
    ng.factory('PostService', PostService.Factory);
}