import express from 'express';

const authRouter = express.Router();
import validateBody from '../middlewares/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../schemas/usersSchemas.js';
import authControllers from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';


//signup
authRouter.post(
    '/register', validateBody(userSignupSchema), authControllers.signup
);

//signin
authRouter.post(
    '/login',
    validateBody(userSigninSchema),
    authControllers.signin
);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.signout);

authRouter.patch(
    '/avatars',
    upload.single('avatar'),
    authenticate,
    authControllers.updateAvatar
);



export default authRouter;