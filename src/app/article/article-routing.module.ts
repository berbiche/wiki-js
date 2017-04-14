import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleComponent }        from './article.component';
import { ArticleDetailsResolve }   from './article-detail/article.resolve';
import { ArticleDetailsComponent } from './article-detail/article-detail.component';

const ArticleRoutes: Routes = [
    {
        'path': 'article',
        'component': ArticleComponent,
        'children': [
            {
                'path': ':title',
                'component': ArticleDetailsComponent,
                'resolve': {
                    'article': ArticleDetailsResolve
                }
            }
        ]
    }
];

@NgModule({
    'imports': [ RouterModule.forChild(ArticleRoutes) ],
    'exports': [ RouterModule ]
})
export class ArticleRoutingModule { }
