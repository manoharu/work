import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class PersonApiService {
    constructor(private http: HttpClient) {

    }

    listPersons() {
        return this.http.get('https://jsonplaceholder.typicode.com/users');
    }

}