// import { Http }                    from '@angular/http';
import { Ng2StateDeclaration }     from 'ui-router-ng2';
import { ArticleDetailsComponent } from './articleDetail.component';
import { ArticleComponent }        from './article.component';
import { ArticleService }          from './article.service';

export const ArticleStates: Ng2StateDeclaration[] = [
    {
        'name': 'article',
        'url': '/article',
        'component': ArticleComponent
    },
    {
        'name': 'article.details',
        'url': '/:title',
        'component': ArticleDetailsComponent,
        'resolve': [
            {
                'token': 'articleDetails',
                'deps': [ ArticleService ],
                'resolveFn': (article: any) => article.getArticle('test')
            }
        ]
    }
]
