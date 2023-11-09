import angular = require('angular');

(window.jasmine as any) = jest;
window.alert = (_str) => {};
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng', 'ngRoute', 'ngMock']);
(providers as any).lazy = {
    controller: providers.controller,
    provider: providers.provider,
    factory: providers.factory,
    service: providers.service,
    config: providers.config,
    module: providers
}

require('../../services/task-a.service');
require('../../services/task-b.service');
require('../../services/task-c.service');
require('./main.component');
let htmlTemplate = require('./main.component.html');

describe('Main Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let srvA: App.TaskAService;
    let component: App.MainPage;
    let scope: angular.IRootScopeService;
    let rootScope: angular.IRootScopeService;
    let ctrl: angular.IControllerService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService, 
                $controller: angular.IControllerService,
                $compile: angular.ICompileService,
                $q: angular.IQService,
                $httpBackend: angular.IHttpBackendService
            )
            {
                $httpBackend.whenGET(/\/*/).passThrough();
                                               
                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                el = angular.element(htmlTemplate);
                $compile(el)(scope);

                const deferred = $q.defer();
                srvA = angular.injector(['MyApp']).get('TaskAService');
                spyOn(srvA, 'GetAll').mockReturnValue(deferred.promise);

                scope.$apply();
                rootScope.$apply();
        });
        component = ctrl('mainPage', { $scope: scope });
    });

    it('Main page should be created', () => {
        expect(component).toBeDefined();
    });

    it('Main page on get test', async () => {
        const spyOnTest = spyOn(component, 'getTest');
        return component.getTest().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnTest).toHaveBeenCalled();
            return true;
        });
    }, 5000);
    
    it('Main page on get task A', (done) => {
        const spyOnTaskA = spyOn(component, 'getTaskA');
        rootScope.$digest();
        component.getTaskA().then((result) => {
            expect((result as any)).not.toBeNull();
        });
        expect(spyOnTaskA).toHaveBeenCalled();
        done();
    }, 5000);

    it('Main page on get task B', (done) => {
        const spyOnTaskB = spyOn(component, 'getTaskB');
        rootScope.$digest();
        component.getTaskB().then((result) => {
            expect((result as any)).not.toBeNull();
        });
        expect(spyOnTaskB).toHaveBeenCalled();
        done();
    }, 5000);

    it('Main page on get task C', (done) => {
        const spyOnTaskC = spyOn(component, 'getTaskC');
        rootScope.$digest();
        component.getTaskC().then((result) => {
            expect((result as any)).not.toBeNull();
        });
        expect(spyOnTaskC).toHaveBeenCalled();
        done();
    }, 5000);

    it('Main page on init', () => {
        const spyOnInit = spyOn(component, 'getData');
        component.getData();
        expect(spyOnInit).toHaveBeenCalled();
    });
});
