namespace App 
{
    let ng = angular.module('MyApp').lazy;

    export class TaskAService 
    {
        private data = [
            { id: 'task-1-a', name: 'Task 1A' },
            { id: 'task-2-a', name: 'Task 2A' },
            { id: 'task-3-a', name: 'Task 3A' },
            { id: 'task-4-a', name: 'Task 4A' },
            { id: 'task-5-a', name: 'Task 5A' }
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
            return new TaskAService(q);
        }
    }

    TaskAService.Factory.$inject = ['$q'];
    ng.factory('TaskAService', TaskAService.Factory);
}