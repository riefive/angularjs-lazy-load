namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class LoginPageController implements angular.IController
    {
        public form = {
            user: '',
            password: ''
        };

        constructor(
            private scope: angular.IScope, 
            private location: angular.ILocationService,
            private authSrv: any, 
        )
        {
        }

        public getForm()
        {
            return this.scope['form'] as angular.IFormController;
        }

        public isInvalid(field: string, type: string): boolean
        {
            let formCurrent = this.getForm()[field] as angular.INgModelController;
            return formCurrent.$error[type] != null && formCurrent.$invalid && formCurrent.$touched;
        }

        public doLogin()
        {   
            if (this.getForm().$invalid) return;
            return this.authSrv.login(this.form.user, this.form.password)
                .then((result: any) => {
                    this.location.path('/');
                    return result;
                });
        }
    }

    LoginPageController.$inject = ['$scope', '$location', 'AuthService'];
    ng.controller('loginPage', LoginPageController);
}