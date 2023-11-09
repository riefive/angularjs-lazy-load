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
require('./todo.service');

describe('Todo Service Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    let service: App.TodoService;
    let rootScope: angular.IRootScopeService;

    const payloadDummies = {
        id: 5,
        title: 'Lorem ipsum',
        completed: true
    };

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService,
                $httpBackend: angular.IHttpBackendService
            ) 
            {
                $httpBackend.whenGET(/\/*/).passThrough();
                $httpBackend.whenPUT(/\/*/).passThrough();
                $httpBackend.whenPOST(/\/*/).passThrough();
                $httpBackend.whenDELETE(/\/*/).passThrough();

                rootScope = $rootScope;
                service = angular.injector(['MyApp']).get('TodoService');
            }
        );
    });

    it('Todo Service should be created', () => {
        expect(service).toBeDefined();
    });

    it('Todo Service get all', (done) => {
        service.GetAll().then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('Todo Service get all by param', (done) => {
        service.GetByParams({ page: 1, limit: 5 }).then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBe(5);
            expect(data[0].id).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('Todo Service get all by param null', (done) => {
        service.GetByParams().then((result: any) => {
            const data = result?.data || [];
            expect(data.length).toBeGreaterThan(0);
            done();
        });
    }, 5000)

    it('Todo Service get one by id', (done) => {
        service.GetOne(1).then((result: any) => {
            const data = result?.data || {};
            expect(data.id).toEqual(1);
            done();
        });
    }, 5000)

    it('Todo Service insert', (done) => {
        service.Insert(payloadDummies).then((result: any) => {
            const data = result?.data || {};
            expect([200, 201]).toEqual(expect.arrayContaining([data.id]));
            expect(data.title).toEqual(payloadDummies.title);
            done();
        });
    }, 5000)

    it('Todo Service update', (done) => {
        service.Update(payloadDummies.id, payloadDummies).then((result: any) => {
            const data = result?.data || {};
            expect(data.id).toEqual(payloadDummies.id);
            expect(data.title).toEqual(payloadDummies.title);
            done();
        });
    }, 5000)

    it('Todo Service delete', (done) => {
        service.Remove(payloadDummies.id).then((result: any) => {
            const status = result?.status || 0;
            expect(status).toEqual(200);
            done();
        });
    }, 5000)
});