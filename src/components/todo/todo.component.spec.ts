import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng', 'ngRoute', 'AuthServiceModule', 'ModalModule']);
(providers as any).lazy = {
    controller: providers.controller,
    provider: providers.provider,
    factory: providers.factory,
    service: providers.service,
    config: providers.config,
    module: providers
}

require('../../config');
require('../../parts/modal.component');
require('../../services/auth.service');
require('../../services/todo.service');
require('./todo.component');
let htmlTemplate = require('./todo.component.html');

describe('Todo Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let srv: App.TodoService;
    let component: App.TodoController;
    let scope: angular.IRootScopeService;
    let rootScope: angular.IRootScopeService;
    let location: angular.ILocationService;
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
                $location: angular.ILocationService,
                $httpBackend: angular.IHttpBackendService,
                TodoService: App.TodoService
            )
            {
                $httpBackend.whenPOST(/\/*/).passThrough();
                $httpBackend.whenGET(/\/*/).passThrough();
                ctrl = $controller;
                cmpnt = $componentController
                rootScope = $rootScope;
                scope = $rootScope.$new();
                location = $location;
                el = angular.element(`${htmlTemplate}`);
                $compile(el)(scope);
                srv = TodoService;
                scope.$apply();
        });
        component = ctrl('todoPage', { $scope: scope, $location: location, TodoService: srv });
    });

    it('Todo page should be created', () => {
        expect(component).toBeDefined();
    });

    it('Todo handle page decrement', () => {
        const spyOnPrevThen = spyOn(component, 'handlePrevious');
        component.page = 1
        component.handlePrevious();
        expect(component.getPage()).toEqual(0);
        expect(spyOnPrevThen).toHaveBeenCalled();
    });

    it('Todo handle page increment', () => {
        const spyOnNextThen = spyOn(component, 'handleNext');
        component.page = 1
        component.handleNext();
        expect(component.getPage()).toEqual(2);
        expect(spyOnNextThen).toHaveBeenCalled();
    });

    it('Todo handle doAdd', () => {
        const spyOnAddThen = spyOn(component, 'doAdd');
        component.doAdd();
        expect(location.path()).toEqual('/todo/add');
        expect(spyOnAddThen).toHaveBeenCalled();
    });

    it('Todo handle doEdit', () => {
        const id = 5
        const spyOnEditThen = spyOn(component, 'doEdit');
        component.doEdit(id);
        expect(location.path()).toEqual(`/todo/${id}`);
        expect(spyOnEditThen).toHaveBeenCalled();
    });

    it('Todo handle doRemove', () => {
        const id = 5
        const spyOnRemoveThen = spyOn(component, 'doRemove');
        component.doRemove(id);
        expect(component.idRemove).toEqual(id);
        expect(spyOnRemoveThen).toHaveBeenCalled();
    });

    it('Todo handle getData', () => {
        const spyOnDataThen = spyOn(component, 'getData');
        rootScope.$digest();
        component.getData().then((result: any) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);
});