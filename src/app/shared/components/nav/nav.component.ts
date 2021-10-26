import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';


import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {


  constructor(
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
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
      data:{
        process: 'signIn'
      }
    });
  }

  get ifUserLoggedIn() {
    return this.cookieService.get('token');
  }

}
