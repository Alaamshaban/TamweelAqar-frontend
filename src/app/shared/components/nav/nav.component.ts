import { CookieService } from 'ngx-cookie-service';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(    
    private cookieService:CookieService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  signUp(){
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '300px'
    });
  }

  signOut() {
    var user = firebase.auth().currentUser;
    this.cookieService.delete('user_uid');
    user.delete();
  }

  get ifUserLoggedIn(){
    return this.cookieService.get('user_uid');
  }

}
