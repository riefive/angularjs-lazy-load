import angular = require('angular');

(window.jasmine as any) = jest;
window.alert = (str) => { console.log(str) };
export {};

require('angular');
require('angular-route');
require('angular-cookies');
require('angular-mocks/ngMockE2E');
require('../config');
require('./modal.component');
let htmlTemplate = require('./modal.component.html');

describe('Modal Component Test', () => {
    let component: App.ModalComponent;
    let scope: angular.IRootScopeService|any;
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let el: any;
    let rootScope: angular.IRootScopeService;
    let cmpnt: angular.IComponentControllerService;

    beforeEach(() => {
        module('ModalModule');
        inject(
            function(
                $rootScope: angular.IRootScopeService, 
                $componentController: angular.IComponentControllerService,
                $compile: angular.ICompileService, 
                $httpBackend: angular.IHttpBackendService
            ) 
            {
                $httpBackend.whenGET(/\/*/).respond(htmlTemplate);
                cmpnt = $componentController;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                el = angular.element(`<modal-custom></modal-custom>`);
                $compile(el)(scope)
                scope.$apply();
        });

        component = cmpnt('modalCustom', { $scope: scope }, {
            id: 'testing',
            removeId: 12345,
            title: 'Testing'
        });
    });

    it('Modal should be created', () => {
        expect(component).toBeTruthy();
    });

    it('Modal should have value testing', () => {
        expect(component.getId()).toEqual('testing');
    });

    it('Modal should have default value hello', () => {
        component = cmpnt('modalCustom', { $scope: scope });
        expect(component.getId()).toEqual('hello');
    });

    it('Modal should be submit success', async () => {
        const content = { id: 'testing', removeId: 12345, title: 'Testing' }
        scope.vm = content
        component = cmpnt('modalCustom', { $scope: scope }, { ...content });
        const spyOnRemoveThen = spyOn(component, 'doRemove');
        rootScope.$digest();
        component.doRemove();
        expect(spyOnRemoveThen).toHaveBeenCalled();
    });

    it('Modal should be submit with element', () => {
        if (el && el.length > 0) {
            console.log(el[0].querySelector('.btn-primary'))
        }
    });
});
