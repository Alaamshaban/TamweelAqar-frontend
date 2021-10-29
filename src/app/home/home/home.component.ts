import { UserService } from './../../shared/services/user.service';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from 'src/app/user/sign-up/sign-up.component';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  offersForm: FormGroup;
  userId: string;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  app: any;
  confirmationResult: any;
  invalidPhoneNumberError: string;
  markerTypes = [
    {
      id: 1,
      desc: 'option 1'
    },
    {
      id: 2,
      desc: 'option 2'
    },
    {
      id: 3,
      desc: 'option 3'
    }
  ]

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private userService: UserService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.setOffersForm();

    this.userId = this.cookieService.get('user_uid');
    if (this.userId) {
      this.offersForm.controls['user_name'].clearValidators();
      this.offersForm.controls['phone_number'].clearValidators();
      this.offersForm.updateValueAndValidity();
      console.log(this.offersForm)
    }
    this.app = firebase.initializeApp(environment.firebase);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'calculate-money',
      {
        size: 'invisible',
        callback: (token) => {
          if (token) {
            this.calculateMoney();
          }
        },
      }
    );
    this.recaptchaVerifier.render();

    // interval to refresh user token every one hour

    setInterval(() => {
      const user = firebase.auth().currentUser;
      user.getIdToken(true).then(token => {
        console.log('>>>>>')
        this.userService.addUser({
          user_name: this.offersForm.value.user_name,
          phone_number: this.offersForm.value.phone_number, token: token, user_id: user.uid
        }).subscribe(res => {
          this.cookieService.set('token', token);
          this.cookieService.set('refresh_token', user.refreshToken);
          this.cookieService.set('user_uid', user.uid);
        });
      });
    }, 30 * 60 * 1000)

  }

  getMortgageLength() {
    return Array(30).fill(0).map((x, i) => i + 1)
  }

  setOffersForm() {
    this.offersForm = this.fb.group({
      user_name: [null, Validators.required],
      phone_number: [null, [Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/), Validators.required]],
      purchase_price: [null, Validators.required],
      user_salary: [null, Validators.required],
      down_payment: [null, Validators.required],
      property_ZIP_code: [null],
      mortgage_term_length: ['',Validators.required],
      email_address: [null]
    });
  }

  // change_mortgage_term_length(e) {
  //   console.log(e)
  //   console.log(e.value)
  //   this.offersForm.get('mortgage_term_length').setValue(e.target.value, {
  //     onlySelf: true
  //   })
  // }

  calculateMoney() {
    if (this.offersForm.valid) {
      console.log(this.offersForm.value)
      if (!this.userId) {
        const appVerifier = this.recaptchaVerifier;
        const num = '+2' + this.offersForm.value.phone_number;
        firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
          this.confirmationResult = result;
          this.dialog.open(SignUpComponent, {
            width: '300px',
            disableClose: true,
            data: {
              process: 'verification',
              confirmation: this.confirmationResult,
              user_name: this.offersForm.value.user_name,
              phone_number: this.offersForm.value.phone_number
            }
          })
        }).catch(err => {
          this.offersForm.controls['phone_number'].setErrors({ invalid_field: true });
          this.invalidPhoneNumberError = err.message;

        });
      } else {
        this.router.navigate(['/offers'], {
          queryParams: {
            purchase_price: this.offersForm.value.purchase_price,
            user_salary: this.offersForm.value.user_salary,
            user_down_payment: this.offersForm.value.down_payment,
            user_mortgage_term_length: this.offersForm.value.mortgage_term_length
          }
        });
      }
    } else {
      Object.keys(this.offersForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.offersForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            this.offersForm.get(key).markAsTouched();
          });
        }
      });
    }

  }
  get f() {
    return this.offersForm.controls;
  }

  ngOnDestroy() {
    this.app.delete();
  }
}
