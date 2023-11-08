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
require('./post.component');
let htmlTemplate = require('./post.component.html');

describe('Post Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let srv: App.PostService;
    let component: App.PostController;
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
                $httpBackend: angular.IHttpBackendService
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
                const injector = angular.injector(['MyApp', 'ng', 'ngMock']);
                srv = injector.get('PostService');
                scope.$apply();
        });
        component = ctrl('postPage', { $scope: scope, $location: location, PostService: srv });
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
});