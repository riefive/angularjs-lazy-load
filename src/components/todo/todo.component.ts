namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class TodoController implements angular.IOnInit
    {
        static $inject = ['$location', 'TodoService', 'TaskCService']
        public columns = [
            { id: 'number', text: '#' },
            { id: 'title', text: 'Title' },
            { id: 'completed', text: 'Completed' },
            { id: 'action', text: '' }
        ]
        public rows: any = []
        public data: any = []
        private page = 1

        constructor(
            private location: angular.ILocationService,
            private todoSrv: TodoService,
            private taskCSrv: TaskCService
        )
        {
            this.$onInit()
        }

        $onInit(): void 
        {
            this.getData()
        }

        getData() 
        {
            this.rows.length = 0;
            this.todoSrv.GetByParams({ page: this.page, limit: 10 }).then((result) => {
                const data = result?.data || []
                this.rows = data
            })
            this.taskCSrv.GetAll().then((result) => {
                this.data = result
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

        doAdd()
        {
            this.handleNavigate('/todo/add')
        }

        doEdit(id: number)
        {
            this.handleNavigate(`/todo/${id}`)
        }
    }

    ng.controller('todoPage', TodoController);
}
