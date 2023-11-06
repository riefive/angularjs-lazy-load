declare namespace angular.route
{
    interface IRoute {
        requiredAuth?: boolean;
        roles: string[];
        title?: string
    }
}