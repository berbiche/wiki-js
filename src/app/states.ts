import { ArticleComponent } from './article/article.component';
import { ArticleService }   from './article/article.service';
import { UserComponent }    from './user/user.component';
import { Transition }       from 'ui-router-ng2';

const articleState = {
    'name': 'article',
    'url': '/article/:title',
    'component': ArticleComponent,
    'resolvePolicy': {
        'async': 'WAIT',
        'when': 'LAZY'
    },
    'resolve': [
        {
            'token': 'article',
            'deps': [Transition, ArticleService],
            'resolveFn': (trans: any, article: any) => {
                return article.getArticle('test');
            }
        }
    ]
};

const userState = {
    'name': 'user',
    'url': '/user',
    'component': UserComponent
};


export const Routes: any[] = [
    articleState,
    userState
];
