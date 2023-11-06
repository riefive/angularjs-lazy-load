namespace App 
{
    let ng = angular.module('MyApp').lazy;

    class TaskAPage implements angular.IOnInit
    {
        static $inject = ['$location', 'TaskAService']
        public data: any = []

        constructor(
            private location: angular.ILocationService,
            private taskASrv: TaskAService
        )
        {
            this.$onInit()
        }

        $onInit(): void {
            this.taskASrv.GetAll().then((result) => {
                this.data = result
            })
        }
    }

    ng.controller('taskAPage', TaskAPage);
}
