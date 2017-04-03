import { NgModule }         from '@angular/core';
// import { Form }             from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { BrowserModule }    from '@angular/platform-browser';
import { MaterialModule }   from '@angular/material';
import { UIRouterModule }   from 'ui-router-ng2';
import { AppComponent }     from './app.component';
import { Routes }           from './states';
import { uiRouterConfigFn } from './config/router.config';

@NgModule({
    'imports': [
        MaterialModule,
        BrowserModule,
        HttpModule,
        UIRouterModule.forRoot({
            'states': Routes,
            'useHash': false,
            'config': uiRouterConfigFn
        })
    ],
    'declarations': [ AppComponent ],
    'bootstrap': [ AppComponent ]
})
export class AppModule { }
