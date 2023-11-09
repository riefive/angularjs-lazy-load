import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng']);
(providers as any).lazy = {
    factory: providers.factory
}

require('../config');
require('./user.service');

describe('User Service Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    let service: App.UserService;
    let rootScope: angular.IRootScopeService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService,
                $httpBackend: angular.IHttpBackendService
            ) 
            {
                $httpBackend.whenGET(/\/*/).passThrough();
                
                rootScope = $rootScope;
                service = angular.injector(['MyApp']).get('UserService');
            }
        );
    });

    it('User Service should be created', () => {
        expect(service).toBeDefined();
    });

    it('User Service get all', (done) => {
        service.GetAll().then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBe(10);
            expect(data[0].id).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('User Service get all by param', (done) => {
        service.GetByParams({ page: 1, limit: 5 }).then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBe(5);
            expect(data[0].id).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('User Service get all by param null', (done) => {
        service.GetByParams().then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBe(10);
            expect(data[0].id).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('User Service get one by id', (done) => {
        service.GetOne(1).then((result: any) => {
            const data = result?.data || {};
            expect(data.id).toEqual(1);
            done();
        });
    }, 5000)
});