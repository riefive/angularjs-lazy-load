/// <reference path='../interfaces/scientist.interface.ts' />

namespace App 
{
    let ng = angular.module('MyApp');

    export class ScientistService 
    {
        constructor(private http: angular.IHttpService, private q: angular.IQService)
        {
        }

        GetAll()
        {
            const result = this.http.get<Scientist[]>(`data/scientist.json`)
            return result;
        }

        static Factory(http: angular.IHttpService, q: angular.IQService)
        {
            return new ScientistService(http, q);
        }
    }

    ScientistService.Factory.$inject = ['$http', '$q'];
    ng.factory('ScientistService', ScientistService.Factory);
}