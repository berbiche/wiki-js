import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { Subscription }         from 'rxjs/Subscription';

import { Article }              from '../../_models/article';


@Component({
    'selector': 'article',
    'moduleId': module.id,
    'templateUrl': 'article-detail.component.html'
})

export class ArticleDetailsComponent implements OnDestroy {
    private article: Article;
    private subscription: Subscription;

    constructor(private route: ActivatedRoute) {
        this.subscription = route.data.subscribe(res => this.article = res.article);
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
