import { Component } from '@angular/core';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationError,
    NavigationCancel
} from '@angular/router';

@Component({
    'selector': 'body',
    'moduleId': module.id,
    'templateUrl': 'app.component.html'
})

export class AppComponent {
    public isLoading: boolean = false;

    constructor(private router: Router) {
        router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                this.isLoading = true;
            } else if (event instanceof NavigationEnd ||
                event instanceof NavigationError ||
                event instanceof NavigationCancel) {
                this.isLoading = false;
            }
        })
    }
}
