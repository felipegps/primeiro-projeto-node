import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AplicationError from '@shared/errors/AplicationError';

interface TokenPayload {
    iat: number,
    ext: number,
    sub: string,
    provider_id: string
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AplicationError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = { id: sub }

        return next();
    } catch {
        throw new AplicationError('Invalid JWT token', 401);
    }
}