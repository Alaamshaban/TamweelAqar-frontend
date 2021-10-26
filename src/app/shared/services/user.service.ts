import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseURL } from 'src/app/base-url';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  addUser(user) {
    console.log(user)
    return this.http.post(BaseURL+'/api/users', user);
  }

}
