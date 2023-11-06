namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class TaskCPage implements angular.IOnInit
    {
        static $inject = ['$location', 'TaskCService']
        public data: any = []

        constructor(
            private location: angular.ILocationService,
            private taskCSrv: TaskCService
        )
        {
            this.$onInit()
        }

        $onInit(): void {
            this.taskCSrv.GetAll().then((result) => {
                this.data = result
            })
        }
    }

    ng.controller('taskCPage', TaskCPage);
}
