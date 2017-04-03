import * as express         from 'express';
import { json, urlencoded } from 'body-parser';
import * as path            from 'path';
import * as compression     from 'compression';
import * as routes          from './routes/routes';
const __dir: string = process.cwd(); // process current directory
const config = require(path.join(__dir, 'config.json'));
const { prefix, locations } = config.output;

const app: express.Application = express();

app.disable('x-powered-by');
app.use(json());
app.use(compression());
app.use(urlencoded({ 'extended': true }));

// static files
app.use('/src', express.static(path.join(__dir, prefix, locations.client), {'index': false}));
app.use('/lib', express.static(path.join(__dir, prefix, locations.libraries), {'index': false}));

// setting up the routes that will be used by the application
// app.use('/login', routes.loginRouter);
app.use('/api/article', routes.articleRouter);
app.use('/', routes.defaultRouter);

app.listen(config.server).once('listening', (): void => {
    process.send(`Express server running at http://localhost:${config.server.port}`
        + ` in ${app.settings.env} mode`);
});
