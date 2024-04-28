import jwt from 'jsonwebtoken';

import HttpError from '../helpers/HttpError.js';

import { findUser } from '../services/authServices.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, 'Not authorized'));
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        return next(HttpError(401, 'Not authorized'));
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await findUser({ _id: id });
        if (!user || !user.token) {
            return next(HttpError(401, 'Not authorized'));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(HttpError(401, 'Not authorized'));
    }
};


export default authenticate;