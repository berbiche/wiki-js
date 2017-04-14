import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { AuthGuard }     from '../_guards/auth-guard.service';


const UserRoutes: Routes = [
    {
        'path': 'user',
        'component': UserComponent
    }
];

@NgModule({
    'imports': [ RouterModule.forChild(UserRoutes) ],
    'exports': [ RouterModule ]
})
export class UserRoutingModule { }
