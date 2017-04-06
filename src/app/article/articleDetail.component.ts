import { Component, Inject } from '@angular/core';
import { ArticleService, Article } from './article.service';

@Component({
    'selector': 'article-detail',
    'template':
    `
        <h3>{{article.title}}</h3>
    `
})
export class ArticleDetailsComponent {
    constructor(@Inject('articleDetails') public article: Article) { }
}
