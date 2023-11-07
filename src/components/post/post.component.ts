namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class PostController implements angular.IOnInit
    {
        static $inject = ['$scope', '$location', 'TodoService']
        public loading = true
        public columns = [
            { id: 'number', text: '#' },
            { id: 'title', text: 'Title' },
            { id: 'action', text: '' }
        ]
        public rows: any = []
        public idRemove: number = 0
        private page = 1

        constructor(
            private scope: angular.IScope,
            private location: angular.ILocationService,
            private postSrv: PostService,
        )
        {
            this.$onInit()
        }

        $onInit(): void 
        {
            const self = this
            this.getData()
            this.scope.$on('removeEvent', function (event, args) {
                const id = args.removeId || 0
                self.handleRemove(id)
             });
        }   

        getData() 
        {
            this.rows.length = 0;
            this.loading = true
            this.postSrv.GetByParams({ page: this.page, limit: 10 }).then((result) => {
                const data = result?.data || []
                this.rows = data
                this.loading = false
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
            if (Number(id) !== Number(this.idRemove)) return
            this.loading = true
            this.postSrv.Remove(this.idRemove)
                .then((result) => {
                    this.idRemove = 0
                    this.loading = false
                });
        }

        doAdd()
        {
            this.handleNavigate('/post/add')
        }

        doEdit(id: number)
        {
            this.handleNavigate(`/post/${id}`)
        }

        doRemove(id: number)
        {
            this.idRemove = id
        }
    }

    ng.controller('postPage', PostController);
}
