namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class TaskBPage implements angular.IOnInit
    {
        static $inject = ['$location', 'TaskBService']
        public data: any = []

        constructor(
            private location: angular.ILocationService,
            private taskBSrv: TaskBService
        )
        {
            this.$onInit()
        }

        $onInit(): void {
            this.taskBSrv.GetAll().then((result) => {
                this.data = result
            })
        }
    }

    ng.controller('taskBPage', TaskBPage);
}
