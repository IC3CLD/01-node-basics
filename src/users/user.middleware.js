import {userModel} from './user.model.js';
import mongoose from "mongoose";
import Joi from 'joi';
import jwt from 'jsonwebtoken'

const {Types} = mongoose;
const {ObjectId} = Types;

function validateAuthUser(req, res, next) {
	const authRules = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(20).required(),
	});

	const validatedAuth = authRules.validate(req.body);

	if (validatedAuth.error) {
		const message = validatedAuth.error.details[0].message;

		return res.status(400).json({ message });
	}

	next();
}

async function validateUserToken(req, res, next) {
	try {
		const authorizationHeader = req.get('Authorization') || '';
		const token = authorizationHeader.replace('Bearer ', '');

		try {
			const userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
			const user = await userModel.findById(userId);

			if (!user || user.token !== token) {
				return res.status(401).json({ message: 'Not authorized' });
			}

			req.user = user;

			next();
		} catch (err) {
			return res.status(401).json({ message: 'Not authorized' });
		}
	} catch (err) {
		next(err);
	}
}

function validateUserID(req, res, next) {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		return res.status(400).send({ message: 'invalid id' });
	}

	next();
}

function validateSub(req, res, next) {
	const { subscription } = req.body;

	if (!subscriptionEnum.includes(subscription)) {
		return res.status(400).send({ message: 'invalid subscription' });
	}

	next();
}

export {
	validateAuthUser,
	validateUserToken,
	validateUserID,
	validateSub,
};