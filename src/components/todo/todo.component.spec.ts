import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng', 'ngRoute', 'ModalModule']);
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
require('../../services/todo.service');
require('./todo.component');
let htmlTemplate = require('./todo.component.html');

describe('Todo Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let component: App.TodoController;
    let scope: angular.IRootScopeService;
    let rootScope: angular.IRootScopeService;
    let location: angular.ILocationService;
    let ctrl: angular.IControllerService;

    beforeEach(() => {
        module('MyApp', 'ngMockE2E');
        inject(
            function(
                $rootScope: angular.IRootScopeService, 
                $controller: angular.IControllerService,
                $compile: angular.ICompileService, 
                $location: angular.ILocationService,
                $httpBackend: angular.IHttpBackendService
            )
            {
                $httpBackend.whenGET('/dist/parts/modal.component.html').respond(require('../../parts/modal.component.html'));
                $httpBackend.whenGET(/\/*/).passThrough();
                $httpBackend.whenDELETE(/\/*/).passThrough();

                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                location = $location;
                el = angular.element(`${htmlTemplate}`);
                $compile(el)(scope);
                scope.$apply();
        });
        component = ctrl('todoPage', { $scope: scope });
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
        const spyOnEditThen = spyOn(component, 'doEdit');
        const id = 5
        component.doEdit(id);
        expect(location.path()).toEqual(`/todo/${id}`);
        expect(spyOnEditThen).toHaveBeenCalled();
    });

    it('Todo handle doRemove', () => {
        const spyOnRemoveThen = spyOn(component, 'doRemove');
        const id = 5
        component.doRemove(id);
        expect(component.idRemove).toEqual(id);
        expect(spyOnRemoveThen).toHaveBeenCalled();
    });

    it('Todo handle getData', async () => {
        const spyOnDataThen = spyOn(component, 'getData');
        rootScope.$digest();
        return component.getData().then((result: any) => {
            expect((result as any)).not.toBeNull();
            expect((result as any).length).toEqual(10);
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Todo handle remove success', async () => {
        const spyOnDataThen = spyOn(component, 'handleRemove');
        const id = 5
        component.idRemove = id
        rootScope.$digest();
        return component.handleRemove(id).then((result: any) => {
            expect((result as any).status).toEqual(200);
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Todo handle remove failed', async () => {
        const spyOnDataThen = spyOn(component, 'handleRemove');
        const id = 5
        component.idRemove = 0
        rootScope.$digest();
        return component.handleRemove(id).then((result: any) => {
            expect((result as any)).not.toBeTruthy();
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Todo handle on emit remove', (done) => {
        const id = 5
        rootScope.$digest();
        scope.$emit('removeEvent', { id: 'todo-remove', removeId: id });
        setTimeout(() => {
            expect(component.idRemove).toEqual(0);
            expect(component.loading).toEqual(false);
            done();
        }, 1000)
    }, 5000);
});