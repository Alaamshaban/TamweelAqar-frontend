import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser;
  firebaseAuth;

  constructor() { }

  set auth(auth) {
this.firebaseAuth=auth;
  }

  set user(user) {
    this.currentUser = user;
  }

  get user() {
    return this.currentUser;
  }

  signOut(){
  return  this.firebaseAuth.signOut();
  }

}
