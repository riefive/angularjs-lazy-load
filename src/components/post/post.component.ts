namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class PostController implements angular.IOnInit
    {
        static $inject = ['$location', 'PostService']
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
            private location: angular.ILocationService,
            private postSrv: PostService,
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
