import { Injectable }                      from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }                      from 'rxjs/Observable';

import { ArticleService } from '../../_services/article.service';
import { Article }        from '../../_models/article';


@Injectable()
export class ArticleDetailsResolve implements Resolve<Article> {

    constructor(private articleService: ArticleService) {}

    public resolve(route: ActivatedRouteSnapshot): Observable<Article> {
        return this.articleService.getArticle(route.params.title);
    }

}
