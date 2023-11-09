import angular = require('angular');

(window.jasmine as any) = jest;
window.alert = (_str) => {};
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng', 'ngRoute']);
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
    let srvB: App.TaskBService;
    let srvC: App.TaskCService;
    let component: App.MainPage;
    let scope: angular.IRootScopeService;
    let rootScope: angular.IRootScopeService;
    let cmpnt: angular.IComponentControllerService;
    let ctrl: angular.IControllerService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService, 
                $controller: angular.IControllerService,
                $componentController: angular.IComponentControllerService,
                $compile: angular.ICompileService, 
                $httpBackend: angular.IHttpBackendService
            )
            {
                $httpBackend.whenPOST(/\/*/).passThrough();
                $httpBackend.whenGET(/\/*/).passThrough();
                ctrl = $controller;
                cmpnt = $componentController
                rootScope = $rootScope;
                scope = $rootScope.$new();
                el = angular.element(`${htmlTemplate}`);
                $compile(el)(scope);
                const injector = angular.injector(['MyApp', 'ng', 'ngMock']);
                srvA = injector.get('TaskAService');
                srvB = injector.get('TaskBService');
                srvC = injector.get('TaskCService');
                scope.$apply();
        });
        component = ctrl('mainPage', { TaskAService: srvA, TaskBService: srvB, TaskCService: srvC });
    });

    it('Main page should be created', () => {
        expect(component).toBeDefined();
    });

    it('Main page on init', (done) => {
        const spyOnInit = spyOn(component, 'getData');
        component.getData();
        expect(spyOnInit).toHaveBeenCalled();
        rootScope.$digest();
        setTimeout(() => {
            done();
        }, 1000)
    }, 5000)
});
