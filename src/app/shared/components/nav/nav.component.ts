
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import firebase from 'firebase/app';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  userLoggedIn = this.cookieService.get('token') && this.cookieService.get('user_uid');

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

  navigateToProfile(){
    this.router.navigate(['user/profile'])
  }

  signOut() {
    firebase.auth(firebase.app('[DEFAULT]')).signOut().then(res => {
      console.log('>>>', res)
      this.cookieService.delete('token');
      this.cookieService.delete('refresh_token');
      this.cookieService.delete('user_uid');
      this.router.navigate(['/home']);
      firebase.app().delete();
      this.userLoggedIn = null;
    });
  }

}
