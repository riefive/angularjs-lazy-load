import angular = require('angular');

(window.jasmine as any) = jest;
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

require('../../config');
require('../../services/todo.service');
require('./todo-id.component');
let htmlTemplate = require('./todo-id.component.html');

describe('TodoId Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let component: App.TodoIdController;
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
                $httpBackend.whenGET(/\/*/).passThrough();
                $httpBackend.whenPOST(/\/*/).passThrough();
                $httpBackend.whenPUT(/\/*/).passThrough();

                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                location = $location;
                el = angular.element(`${htmlTemplate}`);
                $compile(el)(scope);
                scope.$apply();
        });
        component = ctrl('todoIdPage', { $scope: scope });
    });

    it('TodoId page should be created', () => {
        expect(component).toBeDefined();
    });

    it('TodoId handle doBack', () => {
        const spyOnBackThen = spyOn(component, 'doBack');
        component.doBack();
        expect(location.path()).toEqual('/todo');
        expect(spyOnBackThen).toHaveBeenCalled();
    });

    it('TodoId handle getForm', () => {
        component.form = { title: '', completed: true };
        const spyGetForm = spyOn(component, 'getForm');
        const formCurrent = component.getForm();
        expect(formCurrent).not.toBeNull();
        expect(spyGetForm).toHaveBeenCalled();
    });

    it('TodoId handle invalid form', () => {
        const spyInvalidForm = spyOn(component, 'isInvalid');
        component.isInvalid('title', 'required');
        expect(spyInvalidForm).toHaveBeenCalled();
    });


    it('TodoId handle getParam with add', (done) => {
        location.path('/todo/add');
        const spyGetParam = spyOn(component, 'getParams');
        component.getParams().then((result) => {
            expect(result).toBeTruthy();
            expect(spyGetParam).toHaveBeenCalled();
            done();
        });
    });

    it('TodoId handle getParam with edit', (done) => {
        const id = 5
        location.path(`/todo/${id}`);
        const spyGetParam = spyOn(component, 'getParams');
        component.getParams().then((result) => {
            console.log(result)
            expect(result).toBeTruthy();
            expect(spyGetParam).toHaveBeenCalled();
            done();
        });
    }, 5000);

    it('TodoId handle doSave failed', () => {
        component.form = { title: '', completed: true };
        component.getForm().$invalid = true;
        const spyOnSave = spyOn(component, 'doSave');
        return component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            return true;
        });
    });

    it('TodoId handle doSave type none', () => {
        component.typeSave = 'none';
        component.getForm().$invalid = false;
        const spyOnSave = spyOn(component, 'doSave');
        return component.doSave().then((result) => {
            expect((result as any)).not.toBeTruthy();
            expect(spyOnSave).toHaveBeenCalled();
            return true;
        });
    });

    it('TodoId handle doSave add success', (done) => {
        component.form = { title: 'Lorem ipsum', completed: true };
        component.typeSave = 'add';
        component.getForm().$invalid = false;
        const spyOnSave = spyOn(component, 'doSave');
        component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            done();
        });
    }, 5000);

    it('TodoId handle doSave edit success', (done) => {
        component.idNumber = 5;
        component.form = { title: 'Lorem ipsum', completed: true };
        component.typeSave = 'edit';
        component.getForm().$invalid = false;
        const spyOnSave = spyOn(component, 'doSave');
        component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            done();
        });
    }, 5000);
});