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
require('../../services/user.service');
require('./user.component');
let htmlTemplate = require('./user.component.html');

describe('User Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let srv: App.UserService;
    let component: App.UserController;
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

                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                location = $location;
                el = angular.element(`${htmlTemplate}`);
                $compile(el)(scope);
                const injector = angular.injector(['MyApp', 'ng', 'ngMock']);
                srv = injector.get('UserService');
                scope.$apply();
        });
        component = ctrl('userPage', { $scope: scope });
    });

    it('User page should be created', () => {
        expect(component).toBeDefined();
    });

    it('User handle page decrement', () => {
        const spyOnPrevThen = spyOn(component, 'handlePrevious');
        component.page = 1
        component.handlePrevious();
        expect(component.page).toEqual(0);
        expect(spyOnPrevThen).toHaveBeenCalled();
    });

    it('User handle page increment', () => {
        const spyOnNextThen = spyOn(component, 'handleNext');
        component.page = 1
        component.handleNext();
        expect(component.page).toEqual(2);
        expect(spyOnNextThen).toHaveBeenCalled();
    });

    it('User get display address with content', () => {
        const userAddress = { street: 'My street', city: 'City', zipcode: '65100' };
        const spyOnDisplayThen = spyOn(component, 'getDisplayStreet');
        const result = component.getDisplayStreet(userAddress);
        expect(result).toEqual('My street, City - 65100');
        expect(spyOnDisplayThen).toHaveBeenCalled();
    });

    it('User get display address with null', () => {
        const spyOnDisplayThen = spyOn(component, 'getDisplayStreet');
        const result = component.getDisplayStreet(null);
        expect(result).toEqual('-');
        expect(spyOnDisplayThen).toHaveBeenCalled();
    });

    it('User handle getData', async () => {
        const spyOnDataThen = spyOn(component, 'getData');
        rootScope.$digest();
        return component.getData().then((result: any) => {
            expect((result as any)).not.toBeNull();
            expect((result as any).length).toEqual(10);
            expect(spyOnDataThen).toHaveBeenCalled();
            return result;
        });
    }, 5000);
});