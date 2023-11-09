namespace App
{
    let ng = angular.module('MyApp').lazy;

    export class TodoIdController implements angular.IController
    {
        static $inject = ['$scope', '$location', 'TodoService']
        public loading = true
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
            const pathFulltext = this.location.path();
            const splitters = pathFulltext.split('/');
            let params = [];
            if (Array.isArray(splitters) && splitters.length == 3)
            {
                params = splitters.slice(1);
            }
            if (params.length > 1)
            {
                this.idNumber = Number(params[1]) > 0 ? Number(params[1]) : 0;
                this.typeSave = Number(params[1]) > 0 ? 'edit' : 'add';
            }
            if (this.typeSave === 'edit')
            {
                this.loading = true;
                return new Promise((resolve) => {
                    this.todoSrv.GetOne(this.idNumber).then((result) => {
                        if (!result.data) {
                           return resolve(false);
                        }
                        this.form.title = result.data?.title;
                        this.form.completed = result.data?.completed;
                        this.loading = false;
                        resolve(true);
                    });
                });
            } 
            else 
            {
                this.loading = false;
                return Promise.resolve(true);
            }
        }

        public isInvalid(field: string, type: string): boolean
        {
            let formCurrent = this.getForm()[field] as angular.INgModelController;
            return formCurrent.$error[type] != null && formCurrent.$invalid && formCurrent.$touched;
        }

        public doBack()
        {
            this.location.path('/todo')
        }

        public doSave()
        {   
            return new Promise((resolve) => {
                if (this.getForm().$invalid) {
                    resolve(false);
                } else if (this.typeSave === 'add') {
                    this.loading = true;
                    this.todoSrv.Insert({ title: this.form.title, completed: this.form.completed })
                        .then((result) => {
                            alert('Berhasil menyimpan ' + JSON.stringify(result.data || ''));
                            this.loading = false;
                            this.location.path('/todo');
                            resolve(result);
                        });
                } else if (this.typeSave === 'edit') {
                    this.loading = true;
                    this.todoSrv.Update(this.idNumber, { title: this.form.title, completed: this.form.completed })
                        .then((result) => {
                            alert('Berhasil mengubah ' + JSON.stringify(result.data || ''));
                            this.loading = false;
                            this.location.path('/todo');
                            resolve(result);
                        });
                } else {
                    this.loading = false;
                    resolve(false);
                }
            });
        }
    }

    ng.controller('todoIdPage', TodoIdController);
}
