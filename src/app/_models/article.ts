export class Article {
    constructor(
        private title: string,
        private content: string,
        private contributor: string,
        private last_modification: Date,
        private revision: number
    ) { }

    public static createFrom({
            title,
            content,
            contributor,
            last_modification,
            revision
        }: any): Article {
        return new Article(title, content, contributor, new Date(last_modification), revision);
    }
}
