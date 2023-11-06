namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class TaskCService 
    {
        private data = [
            { id: 'task-1-c', name: 'Task 1C' },
            { id: 'task-2-c', name: 'Task 2C' },
            { id: 'task-3-c', name: 'Task 3C' },
            { id: 'task-4-c', name: 'Task 4C' },
            { id: 'task-5-c', name: 'Task 5C' }
        ]

        constructor(private q: angular.IQService) 
        {
        }

        GetAll()
        {
            var deferred = this.q.defer();
            var promise = deferred.promise;

            setTimeout(() => {
                deferred.resolve(this.data)
            }, 150)

            return promise
        }

        static Factory(q: angular.IQService)
        {
            return new TaskCService(q);
        }
    }

    TaskCService.Factory.$inject = ['$q'];
    ng.factory('TaskCService', TaskCService.Factory);
}