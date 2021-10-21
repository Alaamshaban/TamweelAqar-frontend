import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [LoginComponent,SignUpComponent],
  imports: [
    CommonModule,
    SharedModule
  ],

})
export class UserModule { }
