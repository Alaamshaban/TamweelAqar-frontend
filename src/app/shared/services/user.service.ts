import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseURL } from 'src/app/base-url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  addUser(user) {
    console.log(user)
    return this.http.post(BaseURL + '/api/users', user);
  }

  getUser() {
    const user_id = this.cookieService.get('user_uid');
    return this.http.get(BaseURL + `/api/users/${user_id}`);
  }

  updateUser(user) {
    const user_id = this.cookieService.get('user_uid');
   return this.http.put(BaseURL + `/api/users/${user_id}`, user);
  }

}
