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
require('../../services/post.service');
require('./post.component');
let htmlTemplate = require('./post.component.html');

describe('Post Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let component: App.PostController;
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
        component = ctrl('postPage', { $scope: scope });
    });

    it('Post page should be created', () => {
        expect(component).toBeDefined();
    });

    it('Post handle page decrement', () => {
        const spyOnPrevThen = spyOn(component, 'handlePrevious');
        component.page = 1
        component.handlePrevious();
        expect(component.getPage()).toEqual(0);
        expect(spyOnPrevThen).toHaveBeenCalled();
    });

    it('Post handle page increment', () => {
        const spyOnNextThen = spyOn(component, 'handleNext');
        component.page = 1
        component.handleNext();
        expect(component.getPage()).toEqual(2);
        expect(spyOnNextThen).toHaveBeenCalled();
    });

    it('Post handle doAdd', () => {
        const spyOnAddThen = spyOn(component, 'doAdd');
        component.doAdd();
        expect(location.path()).toEqual('/post/add');
        expect(spyOnAddThen).toHaveBeenCalled();
    });

    it('Post handle doEdit', () => {
        const id = 5
        const spyOnEditThen = spyOn(component, 'doEdit');
        component.doEdit(id);
        expect(location.path()).toEqual(`/post/${id}`);
        expect(spyOnEditThen).toHaveBeenCalled();
    });

    it('Post handle doRemove', () => {
        const id = 5
        const spyOnRemoveThen = spyOn(component, 'doRemove');
        component.doRemove(id);
        expect(component.idRemove).toEqual(id);
        expect(spyOnRemoveThen).toHaveBeenCalled();
    });

    it('Post handle getData', async () => {
        const spyOnDataThen = spyOn(component, 'getData');
        rootScope.$digest();
        return component.getData().then((result: any) => {
            expect((result as any)).not.toBeNull();
            expect((result as any).length).toEqual(10);
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Post handle remove success', async () => {
        const id = 5
        component.idRemove = id
        const spyOnDataThen = spyOn(component, 'handleRemove');
        rootScope.$digest();
        return component.handleRemove(id).then((result: any) => {
            expect((result as any).status).toEqual(200);
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Post handle remove failed', async () => {
        const id = 5
        component.idRemove = 0
        const spyOnDataThen = spyOn(component, 'handleRemove');
        rootScope.$digest();
        return component.handleRemove(id).then((result: any) => {
            expect((result as any)).not.toBeTruthy();
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);

    it('Post handle on emit remove', (done) => {
        const id = 5
        rootScope.$digest();
        scope.$emit('removeEvent', { id: 'post-remove', removeId: id });
        setTimeout(() => {
            expect(component.idRemove).toEqual(0);
            expect(component.loading).toEqual(false);
            done();
        }, 1000)
    }, 5000);
});