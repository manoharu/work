import { ComponentFactory } from "@angular/core";

export interface Person {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    website: string;
    company: Company;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo
}

export interface Geo {
    lat: string;
    lng: string;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}