import { Ng2StateDeclaration } from 'ui-router-ng2';
import { UserComponent }       from './user/user.component';
import { ArticleStates }       from './article/article.states';

const userState = {
    'name': 'user',
    'url': '/user',
    'component': UserComponent
};


export const States: Ng2StateDeclaration[] = [
    ArticleStates,
    userState
];
