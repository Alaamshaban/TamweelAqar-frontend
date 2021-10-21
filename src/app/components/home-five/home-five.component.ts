import { Component, OnInit } from '@angular/core';

import { WindowService } from 'src/app/services/window.service';

import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from 'src/environments/environment';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home-five',
  templateUrl: './home-five.component.html',
  styleUrls: ['./home-five.component.scss']
})

export class HomeFiveComponent implements OnInit {

  windowRef: any;
  verificationCode: string;
  phoneNumber;
  user: any;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(public cookieService: CookieService, private win: WindowService) { }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;
    firebase.initializeApp(environment.firebase);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (token) => {
          if (token) {
            this.sendLoginCode(token);
          }
        },
      }
    );
    this.windowRef.recaptchaVerifier.render();
  }

  // getToken(): void {
  //   this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //     'signup-btn',
  //     {
  //       size: 'invisible',
  //       callback: (token) => {
  //         if (token) {
  //           this.signUp(token);
  //         }
  //       },
  //     }
  //   );
  //   this.recaptchaVerifier.render();
  // }

  sendLoginCode(token) {
    console.log('token>>', token)
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = '+20' + this.phoneNumber;
    firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
      this.windowRef.confirmationResult = result;
    });

  }

  verifyLoginCode(): void {
    this.windowRef.confirmationResult.confirm(this.verificationCode).then(result => {
      console.log(result);
      this.user = result.user;
      this.cookieService.set('user_uid', this.user.uid)

    }).catch(error => console.log(error, 'incorrect code entered'));
  }

  signOut() {
    var user = firebase.auth().currentUser;
    this.cookieService.delete('user_uid');
    user.delete();
  }

}
