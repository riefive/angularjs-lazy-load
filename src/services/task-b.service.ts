namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class TaskBService 
    {
        private data = [
            { id: 'task-1-b', name: 'Task 1B' },
            { id: 'task-2-b', name: 'Task 2B' },
            { id: 'task-3-b', name: 'Task 3B' },
            { id: 'task-4-b', name: 'Task 4B' },
            { id: 'task-5-b', name: 'Task 5B' }
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
            return new TaskBService(q);
        }
    }

    TaskBService.Factory.$inject = ['$q'];
    ng.factory('TaskBService', TaskBService.Factory);
}