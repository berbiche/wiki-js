import { Injectable, Inject }            from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable }                    from 'rxjs/Observable';

export class Article {
    constructor(
        public title: string,
        public content: string,
        private idContributor: number,
        private last_modification: Date,
        private revision: number
    ) { }

    public setContributor(id: number): void {
        this.idContributor = id;
    }

    public setLastModification(date: Date): void {
        this.last_modification = date;
    }

    public setRevision(no: number): void {
        this.revision = no;
    }
}

// class CustomQueryEncoder extends QueryEncoder {

// }

@Injectable()
export class ArticleService {
    constructor(@Inject(Http) private http: Http) {}

    /**
     * @param title Article's title
     * @returns An Observable<Article>
     */
    public getArticle(title: string): Observable<Article> {
        return this.http.get(`/api/article/${title}`)
            .map(data => <Article>data.json())
            .catch(data => new Observable<Article>());
    }

    public updateArticle(article: Article): {} {
        const options: RequestOptions = new RequestOptions({
            'headers': new Headers({
                'Content-type': '',
                'Cache-Control': ['no-cache', 'no-store']
            })
        });

        return this.http.post('/api/article', options)
            .map(data => data.json());
    }

}
