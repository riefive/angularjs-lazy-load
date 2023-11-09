namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class UserController implements angular.IOnInit
    {
        static $inject = ['$scope', '$location', 'UserService']
        public loading = true
        public columns = [
            { id: 'number', text: '#' },
            { id: 'name', text: 'Name' },
            { id: 'username', text: 'Username' },
            { id: 'email', text: 'Email' },
            { id: 'address', text: 'Address' }
        ]
        public rows: any = []
        public page = 1

        constructor(
            private scope: angular.IScope,
            private location: angular.ILocationService,
            private userSrv: UserService,
        )
        {
            this.$onInit()
        }

        $onInit(): void {
            this.getData()
        }

        getData() {
            this.rows.length = 0;
            this.loading = true;
            return this.userSrv.GetByParams({ page: this.page, limit: 10 }).then((result) => {
                const data = result?.data;
                this.rows = data;
                this.loading = false;
                return data;
            })
        }

        getDisplayStreet(address: any) {
            return address?.street ? `${address?.street}, ${address?.city} - ${address.zipcode}` : '-'
        }

        handlePrevious() {
            this.page--;
        }

        handleNext() {
            this.page++;
        }
    }

    ng.controller('userPage', UserController);
}
