import { UIRouter } from 'ui-router-ng2';
import { Injector, Injectable } from '@angular/core';
import { ArticleService } from './article/article.service';

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {
    const articleService = injector.get(ArticleService);
    router.urlService.rules.otherwise({ 'state': 'article' });
}
