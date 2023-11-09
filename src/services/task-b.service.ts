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

        Get()
        {
            return Promise.resolve(this.data)
        }

        GetAll()
        {
            let deferred = this.q.defer();
            let promise = deferred.promise;
            deferred.resolve(this.data);
            return promise;
        }

        static Factory(q: angular.IQService)
        {
            return new TaskBService(q);
        }
    }

    TaskBService.Factory.$inject = ['$q'];
    ng.factory('TaskBService', TaskBService.Factory);
}