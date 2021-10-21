import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
export class SignUpComponent implements OnInit {
  signUPForm: FormGroup;
  verificationForm: FormGroup;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  confirmationResult: any;

  constructor(
    private fb: FormBuilder,
    public cookieService: CookieService,
    private router:Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignUpComponent>) { }

  ngOnInit(): void {
    this.setForms();
    firebase.initializeApp(environment.firebase);
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
    this.confirmationResult.confirm(this.verificationForm.value.verification_code).then(result => {
      console.log(result);
      this.cookieService.set('user_uid', result.user.uid);
      this.dialogRef.close();
      this.router.navigate(['/offers']);
      

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


}
