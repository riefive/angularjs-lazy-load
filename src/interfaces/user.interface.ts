declare interface UserAddress
{
    street?: string
    suite?: string
    city?: string
    zipcode?: string
    geo: { lat: number | string, lng: number | string}
}

declare interface User
{
    id: number | string,
    name: string,
    username: string,
    email: string,
    address: UserAddress | any
    phone: string
    website: string
    company: { name: string | null, catchPhrase: string | any, bs: string | null }
}