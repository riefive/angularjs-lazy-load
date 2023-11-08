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

require('./task-c.service');

describe('TaskC Service Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    let service: App.TaskCService;
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
                service = angular.injector(['MyApp', 'ng']).get('TaskCService');
            }
        );
    });

    it('TaskC Service should be created', () => {
        expect(service).toBeDefined();
    });

    it('TaskC Service get all', (done) => {
        service.GetAll().then((result: any) => {
            expect(result.length).toBe(5)
            expect(result[0].id).toEqual('task-1-c')
            done();
        });
    }, 5000)
});