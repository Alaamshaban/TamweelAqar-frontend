
import { OffersService } from './../../shared/services/offers.service';
import { UserService } from './../../shared/services/user.service';
import { Router } from '@angular/router';
import { Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
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
  phonNumberSignInForm: FormGroup;
  emailFormSignIn: FormGroup;
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
    private ngZone: NgZone,
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
    if (this.data && this.data.process === 'signIn') {
      this.loginProcess = true;
    }
    const btn_id = this.loginProcess ? 'signIn-btn' : 'signup-btn'
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      btn_id,
      {
        size: 'invisible',
        callback: (token) => {
          console.log(token)
          if (token) {
            this.sendLoginCode(token);
          }
        },
      }
    );
    console.log('...', this.recaptchaVerifier)
    this.recaptchaVerifier.render();
  }

  sendLoginCode(token) {
    console.log(token)
    const appVerifier = this.recaptchaVerifier;
    const num = this.loginProcess ? this.phonNumberSignInForm.value.phone_number : this.signUPForm.value.phone_number;
    firebase.auth().signInWithPhoneNumber('+20' + num, appVerifier).then(result => {
      this.confirmationResult = result;
    }).catch(err => {
      this.loginProcess ? this.phonNumberSignInForm.controls['phone_number'].setErrors({ invalid_field: true }) :
        this.signUPForm.controls['phone_number'].setErrors({ invalid_field: true });
      this.invalidPhoneNumberError = err.message;
    });
  }

  verifyLoginCode(): void {
    if (!this.confirmationResult && this.data.process === 'verification') {
      this.confirmationResult = this.data.confirmation;
      this.signUPForm.controls['full_name'].setValue(this.data.offersForm.full_name);
      this.signUPForm.controls['phone_number'].setValue(this.data.offersForm.phone_number);
    }
    this.confirmationResult.confirm(this.verificationForm.value.verification_code).then(result => {
      const user = firebase.auth().currentUser;
      user.getIdToken(true).then(token => {
        if (this.loginProcess) {
          this.updateUser(result, token)
        } else {
          this.createUser(result, token);
        }

      });

      this.dialogRef.close();
    }).catch(error => {
      this.verificationForm.controls['verification_code'].setErrors({ invalid_field: true });
      this.invalidVerificationCode = error.message;
    });
  }

  updateUser(result, token) {
    this.cookieService.set('user_uid', result.user.uid);
    this.cookieService.set('token', token);
    this.userService.updateUser({ ...this.phonNumberSignInForm.value, token: token, user_id: result.user.uid }).subscribe(res => {
      window.location.reload();
    });
  }

  createUser(result, token) {
    this.userService.addUser({ ...this.signUPForm.value, token: token, user_id: result.user.uid }).subscribe(res => {
      this.cookieService.set('token', token);
      this.cookieService.set('user_uid', result.user.uid);
      window.location.reload();
      if (this.data && this.data.offersForm) {
        this.router.navigate(['/offers'], {
          queryParams: {
            purchase_price: this.data.offersForm.purchase_price,
            user_salary: this.data.offersForm.user_salary,
            user_down_payment: this.data.offersForm.down_payment,
            user_mortgage_term_length: this.data.offersForm.mortgage_term_length
          }
        });
      }
    });
  }

  backToLogin() {
    this.dialogRef.close();
    this.dialog.open(SignUpComponent, {
      data: {
        process: 'signIn'
      }
    })
  }

  // // Sign in with email/password
  SignInWithEmail() {
    const { email_address, password } = this.emailFormSignIn.value;
    console.log(email_address, password)
    return firebase.auth().signInWithEmailAndPassword(email_address, password)
      .then((result) => {
        console.log(result)
        this.cookieService.set('user_uid', result.user.uid);
        this.userService.getUser().subscribe(res => {
          this.dialogRef.close();
          window.location.reload();
        }, (err) => {
          this.dialogRef.close();
          window.location.reload();
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }



  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px'
    });
  }

  setForms(): void {
    this.signUPForm = this.fb.group({
      full_name: [null, Validators.required],
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]],
    });
    this.verificationForm = this.fb.group({
      verification_code: [null, Validators.required]
    });
    this.phonNumberSignInForm = this.fb.group({
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]]
    })
    this.emailFormSignIn = this.fb.group({
      email_address: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required],
    })
  }

  get f() {
    return this.signUPForm.controls;
  }

  get verificationF() {
    return this.verificationForm.controls;
  }

  get phone_signIn_form() {
    return this.phonNumberSignInForm.controls;
  }

  get email_signIn_form() {
    return this.emailFormSignIn.controls;
  }

  ngOnDestroy() {
    // this.app.delete();
  }


}
