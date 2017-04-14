import { NgModule } from '@angular/core';

import { UserComponent }     from './user.component';
import { UserRoutingModule } from './user-routes.module';

/** The Bar NgModule */
@NgModule({
  'imports': [
    UserRoutingModule
  ],
  'exports': [
    UserRoutingModule
  ],
  'declarations': [ UserComponent ]
})
export class UserModule { }
