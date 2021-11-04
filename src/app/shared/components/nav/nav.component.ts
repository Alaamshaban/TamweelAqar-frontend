
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import firebase from 'firebase/app';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {


  constructor(
    private cookieService: CookieService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  signUp() {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '300px'
    });
  }

  signIn() {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '300px',
      data: {
        process: 'signIn'
      }
    });
  }

  get ifUserLoggedIn() {
    return this.cookieService.get('token') && this.cookieService.get('user_uid');
  }

  signOut() {
    firebase.auth(firebase.app('[DEFAULT]')).signOut().then(res => {
      this.cookieService.deleteAll();
      this.router.navigate(['/home']);
      firebase.app().delete();
    });
  }

}
