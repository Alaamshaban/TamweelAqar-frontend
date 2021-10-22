import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser;
  constructor() { }
  set user(user) {
    this.currentUser = user;
  }
  get user() {
    return this.currentUser;
  }
}
