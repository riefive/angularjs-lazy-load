namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class PostController implements angular.IOnInit
    {
        static $inject = ['$location', 'PostService']
        public columns = [
            { id: 'number', text: '#' },
            { id: 'title', text: 'Title' }
        ]
        public rows: any = []
        public data: any = []

        constructor(
            private location: angular.ILocationService,
            private postSrv: PostService,
        )
        {
            this.$onInit()
        }

        $onInit(): void {
            this.rows.length = 0;
            this.postSrv.GetAll().then((result) => {
                const data = result?.data || []
                this.rows = data
            })
        }
    }

    ng.controller('postPage', PostController);
}
