namespace App
{
    let ng = angular.module('MyApp').lazy;

    export class MainPage implements angular.IOnInit
    {
        static $inject = ['TaskAService', 'TaskBService', 'TaskCService']
        public dataA: any = []
        public dataB: any = []
        public dataC: any = []

        constructor(
            private taskASrv: TaskAService,
            private taskBSrv: TaskBService,
            private taskCSrv: TaskCService,
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
            this.dataA = [];
            this.dataB = [];
            this.dataC = [];
            this.taskASrv.GetAll().then((result) => {
                this.dataA = result
            })
            this.taskBSrv.GetAll().then((result) => {
                this.dataB = result
            })
            this.taskCSrv.GetAll().then((result) => {
                this.dataC = result
            })
        }
    }

    ng.controller('mainPage', MainPage);
}