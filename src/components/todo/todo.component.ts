namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class TodoController implements angular.IOnInit
    {
        static $inject = ['$scope', '$location', 'TodoService']
        public loading = true
        public columns = [
            { id: 'number', text: '#' },
            { id: 'title', text: 'Title' },
            { id: 'completed', text: 'Completed' },
            { id: 'action', text: '' }
        ]
        public rows: any = []
        public idRemove: number = 0
        public page = 1

        constructor(
            private scope: angular.IScope,
            private location: angular.ILocationService,
            private todoSrv: TodoService
        )
        {
            this.$onInit()
        }

        $onInit(): void 
        {
            const self = this
            this.getData()
            this.scope.$on('removeEvent', function (event, args) {
               const id = args.removeId;
               self.handleRemove(id);
            });
        }

        getData() 
        {
            this.rows.length = 0;
            this.loading = true
            return this.todoSrv.GetByParams({ page: this.page, limit: 10 }).then((result) => {
                const data = result?.data;
                this.rows = data;
                this.loading = false;
                return data;
            })
        }

        getPage()
        {
            return this.page
        }

        handlePrevious() 
        {
            this.page--;
            this.getData()
        }

        handleNext() 
        {
            this.page++;
            this.getData()
        }

        handleNavigate(path: string)
        {
            this.location.path(path)
        }

        handleRemove(id: number)
        {
            return new Promise((resolve) => {
                if (Number(id) !== Number(this.idRemove)) {
                    resolve(false);
                } else {
                    this.loading = true;
                    this.todoSrv.Remove(this.idRemove)
                        .then((result) => {
                            this.idRemove = 0;
                            this.loading = false;
                            resolve(result);
                        });
                }
            });
        }

        doAdd()
        {
            this.handleNavigate('/todo/add')
        }

        doEdit(id: number)
        {
            this.handleNavigate(`/todo/${id}`)
        }

        doRemove(id: number)
        {
            this.idRemove = id
        }
    }

    ng.controller('todoPage', TodoController);
}
