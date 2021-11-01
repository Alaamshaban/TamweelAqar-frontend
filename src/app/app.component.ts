import { environment } from './../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent implements OnInit, OnDestroy {
    location: any;
    routerSubscription: any;
    userActivity;
    userInactive: Subject<any> = new Subject();

    constructor(
        private cookieService: CookieService,
        private router: Router) {
        this.setTimeout();
        this.userInactive.subscribe(() => {
            console.log('user has been inactive for an hour');
            // interval to refresh user token every one hour

            setInterval(() => {
                console.log('>>>>>',firebase.app('[DEFAULT]'))
                if (firebase.app('[DEFAULT]')) {
                    const user = firebase.auth(firebase.app('[DEFAULT]')).currentUser;
                    user.getIdToken(true).then(token => {
                        //   this.userService.addUser({
                        //     user_name: this.offersForm.value.user_name,
                        //     phone_number: this.offersForm.value.phone_number, token: token, user_id: user.uid
                        //   }).subscribe(res => {
                        this.cookieService.set('token', token);
                        this.cookieService.set('refresh_token', user.refreshToken);
                        this.cookieService.set('user_uid', user.uid);
                        //    });
                    });

                }
            }, 3600000)
        });
    }


    setTimeout() {
        this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3600000);
    }

    @HostListener('window:mousemove') refreshUserState() {
        clearTimeout(this.userActivity);
        this.setTimeout();
    }

    ngOnInit() {
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    $('.loader').fadeIn('slow');
                }
            });
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
                $.getScript('../assets/js/custom.js');
                $('.loader').fadeOut('slow');
                this.location = this.router.url;
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
            });
    }

    ngOnDestroy() {
        //  this.app.delete();
    }
}