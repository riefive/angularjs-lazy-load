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
require('../../services/post.service');
require('./post-id.component');
let htmlTemplate = require('./post-id.component.html');

describe('PostId Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let component: App.PostIdController;
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
        component = ctrl('postIdPage', { $scope: scope });
    });

    it('PostId page should be created', () => {
        expect(component).toBeDefined();
    });

    it('PostId handle doBack', () => {
        const spyOnBackThen = spyOn(component, 'doBack');
        component.doBack();
        expect(location.path()).toEqual('/post');
        expect(spyOnBackThen).toHaveBeenCalled();
    });

    it('PostId handle getForm', () => {
        const spyGetForm = spyOn(component, 'getForm');
        component.form = { title: '', body: '' };
        const formCurrent = component.getForm();
        expect(formCurrent).not.toBeNull();
        expect(spyGetForm).toHaveBeenCalled();
    });

    it('PostId handle invalid form', () => {
        const spyInvalidForm = spyOn(component, 'isInvalid');
        component.isInvalid('title', 'required');
        expect(spyInvalidForm).toHaveBeenCalled();
    });


    it('PostId handle getParam with add', (done) => {
        const spyGetParam = spyOn(component, 'getParams');
        location.path('/post/add');
        component.getParams().then((result) => {
            expect(result).toBeTruthy();
            expect(spyGetParam).toHaveBeenCalled();
            done();
        });
    });

    it('PostId handle getParam with edit', (done) => {
        const spyGetParam = spyOn(component, 'getParams');
        const id = 5
        location.path(`/post/${id}`);
        component.getParams().then((result) => {
            console.log(result)
            expect(result).toBeTruthy();
            expect(spyGetParam).toHaveBeenCalled();
            done();
        });
    }, 5000);

    it('PostId handle doSave failed', () => {
        const spyOnSave = spyOn(component, 'doSave');
        component.form = { title: '', body: '' };
        component.getForm().$invalid = true;
        return component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            return true;
        });
    });

    it('PostId handle doSave type none', () => {
        const spyOnSave = spyOn(component, 'doSave');
        component.typeSave = 'none';
        component.getForm().$invalid = false;
        return component.doSave().then((result) => {
            expect((result as any)).not.toBeTruthy();
            expect(spyOnSave).toHaveBeenCalled();
            return true;
        });
    });

    it('PostId handle doSave add success', (done) => {
        const spyOnSave = spyOn(component, 'doSave');
        component.form = { title: 'Lorem ipsum', body: 'Lorem ipsum' };
        component.typeSave = 'add';
        component.getForm().$invalid = false;
        component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            done();
        });
    }, 5000);

    it('PostId handle doSave edit success', (done) => {
        const spyOnSave = spyOn(component, 'doSave');
        component.idNumber = 5;
        component.form = { title: 'Lorem ipsum', body: 'Lorem ipsum' };
        component.typeSave = 'edit';
        component.getForm().$invalid = false;
        component.doSave().then((result) => {
            expect((result as any)).not.toBeNull();
            expect(spyOnSave).toHaveBeenCalled();
            done();
        });
    }, 5000);
});