import {UIRouterModule}  from "ui-router-ng2";
import {SharedModule}    from "../shared.module";
import {NgModule}        from "@angular/core";
import { UserComponent } from './user.component';

/** The Bar NgModule */
@NgModule({
  'imports': [
    SharedModule
  ],
  'declarations': [
      UserComponent
  ]
})
export class UserModule { }
