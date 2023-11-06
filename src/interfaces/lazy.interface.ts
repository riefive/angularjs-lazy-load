declare interface LazyCache extends angular.IModule
{
}

declare namespace angular
{
    interface IModule
    {
        lazy?: LazyCache
    }
}