import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', []);
(providers as any).lazy = {
    factory: providers.factory
}

require('./task-b.service');

describe('TaskB Service Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    let service: App.TaskBService;
    let rootScope: angular.IRootScopeService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService,
                $httpBackend: angular.IHttpBackendService
            ) 
            {
                $httpBackend.whenPOST(/\/*/).passThrough();
                $httpBackend.whenGET(/\/*/).passThrough();
                rootScope = $rootScope;
                service = angular.injector(['MyApp', 'ng']).get('TaskBService');
            }
        );
    });

    it('TaskB Service should be created', () => {
        expect(service).toBeDefined();
    });

    it('TaskB Service get all', (done) => {
        service.GetAll().then((result: any) => {
            expect(result.length).toBe(5)
            expect(result[0].id).toEqual('task-1-b')
            done();
        });
    }, 5000)
});