import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

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







}
