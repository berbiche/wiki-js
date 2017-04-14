import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
// import { Form }                 from '@angular/forms';
import { HttpModule }              from '@angular/http';
import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule }          from '@angular/material';

import { AppRoutingModule }      from './app.routes';
import { AppComponent }          from './app.component';
import { ArticleService }        from './_services/article.service';
import { UserModule }            from './user/user.module';
import { ArticleModule }         from './article/article.module';
import { ArticleDetailsResolve } from './article/article-detail/article.resolve';

@NgModule({
    'imports': [
        BrowserModule,
        HttpModule,
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule.forRoot(),
        AppRoutingModule,
        ArticleModule,
        UserModule
    ],
    'declarations': [ AppComponent ],
    'providers': [
        ArticleService,
        ArticleDetailsResolve
    ],
    'bootstrap': [ AppComponent ]
})
export class AppModule { }
