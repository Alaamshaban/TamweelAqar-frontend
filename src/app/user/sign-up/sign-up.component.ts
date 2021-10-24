import { OffersService } from './../../shared/services/offers.service';
import { UserService } from './../../shared/services/user.service';
import { Router } from '@angular/router';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';
import 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUPForm: FormGroup;
  verificationForm: FormGroup;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  confirmationResult: any;
  app: any;

  loginProcess: boolean = false;

  constructor(
    private fb: FormBuilder,
    public cookieService: CookieService,
    private userService: UserService,
    private offersService: OffersService,
    private router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setForms();
    if (!firebase.apps.length) {
      this.app = firebase.initializeApp(environment.firebase);

    } else {
      this.app = firebase.app(); // if already initialized, use that one
    }
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'signup-btn',
      {
        size: 'invisible',
        callback: (token) => {
          if (token) {
            this.sendLoginCode(token);
          }
        },
      }
    );
    this.recaptchaVerifier.render();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        // User is signed in and token is expired
        this.loginProcess = true;
        // user.getIdToken().then(idToken => {
        //   console.log(idToken)
        //   this.cookieService.set('token', idToken);
        // });
      } else {
        console.log('no user');
        this.loginProcess = false;
        /** sign up pop-up will appear */
        // No user is signed in.
      }
    });
    if (this.data && this.data.process === 'signIn') {
      console.log(this.data)
      this.loginProcess = true;
      this.signUPForm.controls['username'].clearValidators();
      this.signUPForm.updateValueAndValidity();
    }
  }

  sendLoginCode(token) {
    console.log('token>>', token)
    const appVerifier = this.recaptchaVerifier;
    const num = '+20' + this.signUPForm.value.phone_number;
    firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
      this.confirmationResult = result;
    });

  }

  verifyLoginCode(): void {
    if (!this.confirmationResult && this.data.process === 'verification') {
      this.confirmationResult = this.data.confirmation;
    }
    this.confirmationResult.confirm(this.verificationForm.value.verification_code).then(result => {
      this.cookieService.set('user_uid', result.user.uid);
      const user = firebase.auth().currentUser;
      firebase.auth().currentUser.getIdToken(true).then(token => {
        this.cookieService.set('token', token);
        this.offersService.getOffers(result.user.uid).subscribe(offers => {
          console.log(offers);
          this.router.navigate(['/offers'], { state: { data: { offers } } });
        });
      });
      this.userService.user = user;
      this.userService.auth = firebase.auth();
      this.dialogRef.close();
    }).catch(error => console.log(error, 'incorrect code entered'));
  }


  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px'
    });
  }

  setForms(): void {
    this.signUPForm = this.fb.group({
      username: [null, Validators.required],
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]],
    });
    this.verificationForm = this.fb.group({
      verification_code: [null, Validators.required]
    });
  }

  get f() {
    return this.signUPForm.controls;
  }

  get verificationF() {
    return this.verificationForm.controls;
  }

  ngOnDestroy() {
    this.app.delete();
  }


}
