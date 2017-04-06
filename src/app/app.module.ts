import { NgModule }         from '@angular/core';
// import { Form }             from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { BrowserModule }    from '@angular/platform-browser';
import { MaterialModule }   from '@angular/material';
import { UIRouterModule }   from 'ui-router-ng2';
import { ArticleModule }    from './article/article.module';
import { UserModule }       from './user/user.module';
import { AppComponent }     from './app.component';
import { States }           from './app.states';
import { uiRouterConfigFn } from './router.config';

@NgModule({
    'imports': [
        MaterialModule,
        BrowserModule,
        HttpModule,
        UIRouterModule.forRoot({
            'states': States,
            'useHash': false,
            'config': uiRouterConfigFn,
            'otherwise': { 'state': 'article', 'params': {} }
        }),
        ArticleModule,
        UserModule
    ],
    'declarations': [ AppComponent ],
    'bootstrap': [ AppComponent ]
})
export class AppModule { }
