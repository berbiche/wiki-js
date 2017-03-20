import { NgModule }         from '@angular/core';
import { UIRouterModule }   from 'ui-router-ng2';
import { BrowserModule }    from '@angular/platform-browser';
import { MaterialModule }   from '@angular/material';
import { WikiComponent }    from './wiki.component';
import { UserComponent }    from './user.component';
import { ArticleComponent } from './article.component';

const articleState = {
    'name': 'article',
    'url': '/article/{title:\S{1,64}}',
    'component': ArticleComponent
};
const userState = {
    'name': 'user',
    'url': '/user',
    'component': UserComponent
};

@NgModule({
    'imports': [
        MaterialModule,
        BrowserModule,
        UIRouterModule.forRoot({ 'states': [ articleState, userState ], 'useHash': false })
    ],
    'declarations': [
        WikiComponent, ArticleComponent
    ],
    'bootstrap': [
        WikiComponent
    ]
})
export class WikiModule { }
