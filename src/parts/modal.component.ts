/// <reference path='../../node_modules/@types/angular/index.d.ts' />
/// <reference path='../interfaces/iscope.interface.ts' />

namespace App 
{
    let ng = angular.module('ModalModule', []);

    export class ModalComponent implements angular.IController 
    {
        constructor(private scope: angular.IScope)
        {
            console.log(this.scope?.vm)
        }
    }

    ModalComponent.$inject = ['$scope'];
    let component: angular.IComponentOptions = {
        controller: ModalComponent,
        templateUrl: `${config.templatePart}/modal.component.html`,
        bindings: {
            id: '@',
            removeId: '@',
            title: '@'
        },
        controllerAs: 'vm'
    };

    ng.component('modalCustom', component);
}