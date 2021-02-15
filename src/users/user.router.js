import { Router } from "express";
import * as userController from "./user.controller.js";
import * as  userMiddleware  from "./user.middleware.js";

const {
	singUpUser,
	signInUser,
	signOutUser,
	getCurrentUser,
	updateUserSubscription,
} = userController;

const {
	validateSignUpUser,
	validateSignInUser,
	validateUserToken,
	validateUserID,
	validateSub,
} = userMiddleware;

const userRouter = Router();

userRouter.post('/register', validateSignUpUser, singUpUser);
userRouter.post('/login', validateSignInUser, signInUser);
userRouter.post('/logout', validateUserToken, signOutUser);
userRouter.get('/current', validateUserToken, getCurrentUser);
userRouter.patch('/:id', validateUserID, validateUserToken, validateSub, updateUserSubscription);

export default userRouter;