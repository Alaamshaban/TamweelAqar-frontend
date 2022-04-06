import { BaseURL } from '../../basURL';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  basUrl = BaseURL;

  loggingOut = new BehaviorSubject(false);

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  addUser(user) {
    console.log(user)
    return this.http.post(this.basUrl + '/api/users', user);
  }

  getUser() {
    const user_id = this.cookieService.get('user_uid');
    return this.http.get(`/api/users/${user_id}`);
  }

  getUserByPhoneNumber(phoneNumber) {
    return this.http.get(`${this.basUrl}/api/users/phone_number/${phoneNumber}`);
  }

  updateUser(user) {
    const user_id = this.cookieService.get('user_uid');
    return this.http.put(`/api/users/${user_id}`, user);
  }

  updateUserHistory(history) {
    const user_id = this.cookieService.get('user_uid');
    return this.http.post(this.basUrl + `/api/users/userhistory`, {user_id:user_id,...history});
  }

  getUserHistory(){
    const user_id = this.cookieService.get('user_uid');
    return this.http.get(this.basUrl + `/api/users/${user_id}/userhistory`);
  }

}
