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
  invalidPhoneNumberError: string;
  invalidVerificationCode: string;
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
    if (this.data && this.data.process === 'signIn') {
      this.loginProcess = true;
      this.signUPForm.controls['username'].clearValidators();
      this.signUPForm.updateValueAndValidity();
    } else {
      firebase.auth().onAuthStateChanged(user => {
        const userId = this.cookieService.get('user_uid');
        if (user && userId) {
          // User is signed in before but token is expired
          this.loginProcess = true;
        } else {
          // no user is signed in before
          this.loginProcess = false;
          /** sign up pop-up will appear */
          // No user is signed in.
        }
      });
    }
  }

  sendLoginCode(token) {
    console.log('token>>', token)
    const appVerifier = this.recaptchaVerifier;
    const num = '+20' + this.signUPForm.value.phone_number;
    firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
      this.confirmationResult = result;
    }).catch(err => {
      this.signUPForm.controls['phone_number'].setErrors({ invalid_field: true });
      this.invalidPhoneNumberError = err.message;

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
    }).catch(error => {
      this.verificationForm.controls['verification_code'].setErrors({ invalid_field: true });
      this.invalidVerificationCode = error.message;
    });
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
