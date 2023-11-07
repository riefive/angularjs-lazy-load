namespace App
{
    let ng = angular.module('MyApp').lazy;

    export class TodoIdController implements angular.IController
    {
        static $inject = ['$scope', '$location', 'TodoService']
        public idNumber = 0
        public typeSave = 'add'
        public form = {
            title: '',
            completed: false
        };

        constructor(
            private scope: angular.IScope, 
            private location: angular.ILocationService,
            private todoSrv: TodoService, 
        )
        {
            this.getParams()
        }

        public getForm()
        {
            return this.scope['form'] as angular.IFormController;
        }

        public getParams()
        {
            const urlFulltext = this.location.absUrl()
            const splitters = urlFulltext.split('/')
            let params = []
            if (Array.isArray(splitters) && splitters.length == 5)
            {
                params = splitters.slice(3)
            }
            if (params.length > 1)
            {
                this.idNumber = Number(params[1]) > 0 ? Number(params[1]) : 0
                this.typeSave = Number(params[1]) > 0 ? 'edit' : 'add'
            }
            if (this.typeSave === 'edit')
            {
                this.todoSrv.GetOne(this.idNumber).then((result) => {
                    if (result.data) {
                        this.form.title = result.data?.title || ''
                        this.form.completed = result.data?.completed || false
                    }
                })
            }
        }

        public isInvalid(field: string, type: string): boolean
        {
            let formCurrent = this.getForm()[field] as angular.INgModelController;
            return formCurrent.$error[type] != null && formCurrent.$invalid && formCurrent.$touched;
        }

        public doSave()
        {   
            if (this.getForm().$invalid) return;
            if (this.typeSave === 'add') 
            {
                this.todoSrv.Insert({ title: this.form.title, completed: this.form.completed })
                    .then((result) => {
                        alert('Berhasil menyimpan ' + JSON.stringify(result.data || ''))
                        this.location.path('/todo');
                    });
            }
            else if (this.typeSave === 'edit')
            {
                this.todoSrv.Update(this.idNumber, { title: this.form.title, completed: this.form.completed })
                    .then((result) => {
                        alert('Berhasil mengubah ' + JSON.stringify(result.data || ''))
                        this.location.path('/todo');
                    });
            }
        }
    }

    ng.controller('todoIdPage', TodoIdController);
}
