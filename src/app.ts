import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalError from './app/middlewares/global-error';
import notFound from './app/middlewares/not-found';
import { router } from './app/routes';
import httpStatus from 'http-status';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
    // following code produces unhandledRejection
    // Promise.reject();
    res.json({ status: httpStatus[200], message: 'Server is running!' });
});

// app routes
app.use('/api/v1', router);

// global error handler
app.use(globalError);

// not found routes
app.all('*', notFound);

export default app;
