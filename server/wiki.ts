import * as express         from 'express';
import { json, urlencoded } from 'body-parser';
import * as path            from 'path';
import * as routes          from './routes/routes';
import * as compression     from 'compression';
const config = require('../../config.json'); // since we are in dist/server

const app: express.Application = express();

app.disable('x-powered-by');
// app.use();
app.use(json());
app.use(compression());
app.use(urlencoded({ 'extended': true }));

// static files
app.use(express.static(path.join(__dirname, 'dist/src')));
app.use(express.static(path.join(__dirname, 'dist/lib')));

// setting up the routes that will be used by the application
// app.use('/login', routes.loginRouter);
app.use('/article', routes.articleRouter);
// app.use('*', routes.defaultRouter);
app.use(function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../src/index.html'));
});

const server = app.listen(config.port, () => {
    console.log('Express server running at http://%s:%d/ in %s mode',
        'localhost',
        config.port,
        app.settings.env);
});
