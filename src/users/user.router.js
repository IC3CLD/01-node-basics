import { Router } from "express";
import * as userController from "./user.controller.js";
import * as  userMiddleware  from "./user.middleware.js";

const {
	singUpUser,
	signInUser,
	signOutUser,
	getCurrentUser,
	updateUserSubscription,
	updateUsersAvatar
} = userController;

const {
	validateAuthUser,
	validateUserToken,
	validateUserID,
	validateSub,
} = userMiddleware;

const userRouter = Router();

userRouter.post('/register', validateAuthUser, singUpUser);
userRouter.post('/login', validateAuthUser, signInUser);
userRouter.post('/logout', validateUserToken, signOutUser);
userRouter.get('/current', validateUserToken, getCurrentUser);
userRouter.patch('/avatars', validateUserToken, updateUsersAvatar);
userRouter.patch('/:id', validateUserID, validateUserToken, validateSub, updateUserSubscription);

export default userRouter;