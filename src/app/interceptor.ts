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
import { catchError } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable()

export class ErrorIntercept implements HttpInterceptor {
    constructor(private cookieService: CookieService) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.status === 401) {
                        errorMessage = '401';
                        if (firebase.app('[DEFAULT]') && firebase.auth(firebase.app('[DEFAULT]')).currentUser) {
                            const user = firebase.auth(firebase.app('[DEFAULT]')).currentUser;
                            user.getIdToken(true).then(token => {
                                this.cookieService.set('token', token);
                                this.cookieService.set('refresh_token', user.refreshToken);
                                this.cookieService.set('user_uid', user.uid);
                            });
                        }
                    }
                    return throwError(errorMessage);
                })
            )
    }
}