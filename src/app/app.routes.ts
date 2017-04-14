import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const AppRoutes: Routes = [];

@NgModule({
    'imports': [
        RouterModule.forRoot(AppRoutes, { 'useHash': false })
    ],
    'exports': [
        RouterModule
    ]
})

export class AppRoutingModule {}

