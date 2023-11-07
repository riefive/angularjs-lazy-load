namespace App
{
    let ng = angular.module('MyApp').lazy;

    export class PostIdController implements angular.IController
    {
        static $inject = ['$scope', '$location', 'PostService']
        public idNumber = 0
        public typeSave = 'add'
        public form = {
            title: '',
            body: ''
        };

        constructor(
            private scope: angular.IScope, 
            private location: angular.ILocationService,
            private postSrv: PostService, 
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
                this.postSrv.GetOne(this.idNumber).then((result) => {
                    if (result.data) {
                        this.form.title = result.data?.title || ''
                        this.form.body = result.data?.body || ''
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
                this.postSrv.Insert({ title: this.form.title, body: this.form.body })
                    .then((result) => {
                        alert('Berhasil menyimpan ' + JSON.stringify(result.data || ''))
                        this.location.path('/todo');
                    });
            }
            else if (this.typeSave === 'edit')
            {
                this.postSrv.Update(this.idNumber, { title: this.form.title, body: this.form.body })
                    .then((result) => {
                        alert('Berhasil mengubah ' + JSON.stringify(result.data || ''))
                        this.location.path('/todo');
                    });
            }
        }
    }

    ng.controller('postIdPage', PostIdController);
}
