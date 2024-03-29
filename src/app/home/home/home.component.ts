import { UserService } from "./../../shared/services/user.service";
import { environment } from "./../../../environments/environment";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SignUpComponent } from "src/app/user/sign-up/sign-up.component";
import {
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from "@angular/forms";
import firebase from "firebase/app";
import "firebase/auth";
import Cities from "../../../assets/json/cities.json";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
    offersForm: FormGroup;
    userId: boolean;
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    app: any;
    confirmationResult: any;
    invalidPhoneNumberError: string;
    markerTypes = [
        {
            id: 1,
            desc: "option 1",
        },
        {
            id: 2,
            desc: "option 2",
        },
        {
            id: 3,
            desc: "option 3",
        },
    ];
    cities = Cities;

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.listenToCookies();
        this.setOffersForm();

        this.userId =
            this.cookieService.get("user_uid") &&
            this.cookieService.get("token")
                ? true
                : false;
        if (this.userId) {
            this.offersForm.controls["full_name"].clearValidators();
            this.offersForm.controls["phone_number"].clearValidators();
            this.offersForm.updateValueAndValidity();
        }
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(environment.firebase);
        } else {
            this.app = firebase.app();
        }
        console.log(this.app);
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "calculate-money",
            {
                size: "invisible",
                callback: (token) => {
                    if (token) {
                        this.calculateMoney();
                    }
                },
            }
        );
        this.recaptchaVerifier.render();
    }

    listenToCookies() {
        setInterval(() => {
            this.userId =
                this.cookieService.get("user_uid") &&
                this.cookieService.get("token")
                    ? true
                    : false;
        }, 5000);
    }

    getMortgageLength() {
        return Array(30)
            .fill(0)
            .map((x, i) => i + 1);
    }

    setOffersForm() {
        this.offersForm = this.fb.group({
            phone_number: [
                null,
                [
                    Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/),
                    Validators.required,
                ],
            ],
            purchase_price: [
                null,
                [
                    Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/),
                    Validators.required,
                ],
            ],
            user_salary: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/),
                ],
            ],
            down_payment: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^(?=.*[0-9])[- +()0-9]+$/),
                ],
            ],
            property_area: [null, Validators.required],
            mortgage_term_length: ["", Validators.required],
            full_name: [null, Validators.required],
        });
    }

    calculateMoney() {
        if (this.offersForm.valid) {
            if (!this.userId) {
                const appVerifier = this.recaptchaVerifier;
                const num = "+2" + this.offersForm.value.phone_number;
                firebase
                    .auth()
                    .signInWithPhoneNumber(num, appVerifier)
                    .then((result) => {
                        this.confirmationResult = result;
                        this.dialog.open(SignUpComponent, {
                            width: "300px",
                            disableClose: true,
                            data: {
                                process: "verification",
                                confirmation: this.confirmationResult,
                                offersForm: this.offersForm.value,
                            },
                        });
                    })
                    .catch((err) => {
                        this.offersForm.controls["phone_number"].setErrors({
                            invalid_field: true,
                        });
                        this.invalidPhoneNumberError = err.message;
                    });
            } else {
                this.router.navigate(["/offers"], {
                    queryParams: {
                        purchase_price: this.offersForm.value.purchase_price,
                        user_salary: this.offersForm.value.user_salary,
                        user_down_payment: this.offersForm.value.down_payment,
                        user_mortgage_term_length:
                            this.offersForm.value.mortgage_term_length,
                        property_area: this.offersForm.value.property_area,
                    },
                });
            }
        } else {
            Object.keys(this.offersForm.controls).forEach((key) => {
                const controlErrors: ValidationErrors =
                    this.offersForm.get(key).errors;
                if (controlErrors != null) {
                    Object.keys(controlErrors).forEach((keyError) => {
                        this.offersForm.get(key).markAsTouched();
                    });
                }
            });
        }
    }
    get f() {
        return this.offersForm.controls;
    }

    onChange(ev) {
        this.offersForm.controls["mortgage_term_length"].setValue(
            ev.target.value
        );
    }

    onChangePropertyArea(ev) {
        this.offersForm.controls["property_area"].setValue(ev.target.value);
    }
    ngOnDestroy() {
        //   if (this.app)
        //     this.app.delete();
    }
}
