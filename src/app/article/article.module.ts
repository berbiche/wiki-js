import { NgModule }                from '@angular/core';
import { HttpModule }              from '@angular/http';
import { MaterialModule }          from '@angular/material';
import { UIRouterModule }          from 'ui-router-ng2';
import { ArticleComponent }        from './article.component';
import { ArticleDetailsComponent } from './articleDetail.component';
import { ArticleService }          from './article.service';
import { ArticleStates }           from './article.states'

@NgModule({
    'imports': [
        MaterialModule,
        HttpModule
    ],
    'providers': [ ArticleService ],
    'declarations': [ ArticleComponent, ArticleDetailsComponent ]
})
export class ArticleModule { }
