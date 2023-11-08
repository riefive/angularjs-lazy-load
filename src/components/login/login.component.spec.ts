import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('jest');

let providers = angular.module('MyApp', ['ng', 'ngRoute', 'AuthServiceModule']);
(providers as any).lazy = {
    controller: providers.controller,
    provider: providers.provider,
    factory: providers.factory,
    service: providers.service,
    config: providers.config,
    module: providers
}

require('../../config');
require('../../services/auth.service');
require('./login.component');
let htmlTemplate = require('./login.component.html');


describe('Login Controller Test', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let srv: App.AuthService;
    let component: App.LoginPageController;
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
                const injector = angular.injector(['AuthServiceModule']);
                srv = injector.get('AuthService');
                scope.$apply();
        });
        component = ctrl('loginPage', { $scope: scope, $location: location, AuthService: srv });
    });

    it('Login page should be created', () => {
        expect(component).toBeDefined();
    });

    it('Login must able to success', (done) => {
        const spyOnLoginThen = spyOn(component, 'doLogin');
        component.form.user = 'admin';
        component.form.password = 'admin';
        component.getForm().$invalid = false;
        rootScope.$digest();
        component.doLogin().then((result: any) => {
            console.log(result)
            expect((result as any).id).not.toBeNull();
            expect(spyOnLoginThen).toHaveBeenCalled();
            done();
        });
    }, 5000);

    it('Login must not sent data when invalid', () => {
        const spyOnLoginThen = spyOn(component, 'doLogin');
        component.getForm().$invalid = true;
        let result = component.doLogin();
        expect(result).toBeUndefined();
        expect(component.getForm().$invalid).toBeTruthy();
        expect(spyOnLoginThen).toHaveBeenCalled();
    });
});