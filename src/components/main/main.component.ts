namespace App
{
    let ng = angular.module('MyApp').lazy;

    export class MainPage implements angular.IOnInit
    {
        static $inject = ['$scope', 'TaskAService', 'TaskBService', 'TaskCService', 'ScientistService']
        public dataA: any = []
        public dataB: any = []
        public dataC: any = []

        constructor(
            private scope: angular.IScope,
            private taskASrv: TaskAService,
            private taskBSrv: TaskBService,
            private taskCSrv: TaskCService,
            private scientistSrv: ScientistService
        )
        {
            this.$onInit()
        }

        $onInit(): void 
        {
            this.getData()
        }

        public getTest()
        {
            return Promise.resolve({ id: 'tester', name: 'Lorem ipsum' })
        }

        public getTaskA()
        {
            this.dataA = [];
            return this.taskASrv.GetAll().then((result) => {
                this.dataA = result;
            })
        }

        public getTaskB()
        {
            this.dataB = [];
            return this.taskBSrv.GetAll().then((result) => {
                this.dataB = result;
                return result;
            })
        }

        public getTaskC()
        {
            this.dataC = [];
            return this.taskCSrv.GetAll().then((result) => {
                this.dataC = result;
                return result;
            })
        }

        getData()
        {
            this.getTaskA();
            this.getTaskB();
            this.getTaskC();
            this.scientistSrv.GetAll();
        }
    }

    ng.controller('mainPage', MainPage);
}