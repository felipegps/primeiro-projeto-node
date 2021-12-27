import 'reflect-metadata';
import 'dotenv/config'; 

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import AplicationError from '@shared/errors/AplicationError';
import routes from './routes';
import { errors } from 'celebrate';
import uploadConfig from '@config/upload';
import cors from 'cors';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AplicationError) {
        return response.status(err.statusCode).json({
            stattus: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        stattus: 'error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {
    console.log('🚀 Server started on port 3333!');
});