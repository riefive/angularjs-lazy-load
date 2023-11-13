import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

angular.module('MyApp', ['ng']);

require('./scientist.service');

describe('Scientist Service Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    let service: App.ScientistService;
    let rootScope: angular.IRootScopeService;
    let http: angular.IHttpService;
    let httpBackend: angular.IHttpBackendService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService,
                $http: angular.IHttpService,
                $httpBackend: angular.IHttpBackendService,
            ) 
            {
                rootScope = $rootScope;
                $http = $http;
                httpBackend = $httpBackend;
                service = angular.injector(['MyApp']).get('ScientistService');
            }
        );
    });

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('Scientist Service should be created', () => {
        expect(service).toBeDefined();
    });

    it('Scientist Service get all', () => {
        let responses = [
            { "firstName": "Isaac", "lastName": "Newton", "address": "101 June Street", "city": "New York", "state":"NY" }
        ];
        httpBackend.when('GET', 'data/scientist.json').respond(responses);
        return service.GetAll().then((result: any) => {
            console.log(result.data);
            return true;
        }).catch((error) => {
            expect(error.data).toBe(null)
            return false
        });
        /*
        service.GetAll().then((result: any) => {
            httpBackend.flush();
            expect(result[0].firstName).toEqual('Isaac')
            done();
        });
        */
    }, 5000);
});