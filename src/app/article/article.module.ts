import { NgModule }                from '@angular/core';
import { HttpModule }              from '@angular/http';
import { MaterialModule }          from '@angular/material';
import { ArticleRoutingModule }    from './article-routing.module';
import { ArticleComponent }        from './article.component';
import { ArticleDetailsComponent } from './article-detail/article-detail.component';

@NgModule({
    'imports': [
        MaterialModule,
        HttpModule,
        ArticleRoutingModule,
    ],
    'declarations': [
        ArticleComponent,
        ArticleDetailsComponent
    ]
})
export class ArticleModule { }
