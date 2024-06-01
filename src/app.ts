import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalError from './app/middlewares/global-error';
import notFound from './app/middlewares/not-found';
import { router } from './app/routes';
const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// app routes
app.use('/api/v1', router);

// global error handler
app.use(globalError);

// not found routes
app.all('*', notFound);

export default app;
