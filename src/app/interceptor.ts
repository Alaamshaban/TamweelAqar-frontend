import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable()

export class ErrorIntercept implements HttpInterceptor {
    constructor(private cookieService: CookieService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.cookieService.get('token')

        request = request.clone({
            headers: request.headers.set('AuthToken', token
            )
        });
        console.log(request)
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    console.log('ejjejejej')
                    if (error.status === 401) {
                        console.log('jjj',firebase.app('[DEFAULT]') )
                        errorMessage = '401';
                        firebase.auth().onAuthStateChanged((user)=> {
                            if (user) {
                                console.log('signed in')
                                const user = firebase.auth(firebase.app('[DEFAULT]')).currentUser;
                                console.log(user)
                                user.getIdToken(true).then(token => {
                                    this.cookieService.set('token', token);
                                    this.cookieService.set('refresh_token', user.refreshToken);
                                    this.cookieService.set('user_uid', user.uid);
                                    console.log(request)
                                });
                                return next.handle(request)
                            }
                          });
                    } else {
                        return throwError(errorMessage);
                    }
                })
            )
    }
}