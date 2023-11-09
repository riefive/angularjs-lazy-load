/// <reference path='../../node_modules/@types/angular/index.d.ts' />
/// <reference path='../interfaces/iscope.interface.ts' />

namespace App 
{
    let ng = angular.module('ModalModule', []);

    export class ModalComponent implements angular.IController 
    {
        constructor(private scope: angular.IScope)
        {
        }

        public getId()
        {
            return this['id'] ?? 'hello'; 
        }

        public doRemove()
        {
            const vm = this.scope.vm
            this.scope.$emit('removeEvent', { id: vm.id, removeId: vm.removeId });
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