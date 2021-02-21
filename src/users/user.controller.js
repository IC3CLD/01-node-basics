import {userModel} from './user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import avatarGen from '../helpers/avatar-gen.js';
import imageCompressor from '../helpers/image-compressor.js'
import path from 'path';
import fs from 'fs';


async function singUpUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const existedUser = await userModel.findOne({ email });

		if (existedUser) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const encryptedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));

		const userAvatar = await avatarGen(next);

		await imageCompressor(userAvatar);

		const user = await userModel.create({
			email,
			password: encryptedPassword,
			avatarURL: process.env.AVATAR_URL + userAvatar,
		});

		const response = {
			user: { email, subscription: user.subscription, avatarURL: user.avatarURL },
		};

		return res.status(201).json(response);
	} catch (error) {
		next(error);
	}
}

async function signInUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const isUserPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isUserPasswordCorrect) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '2d',
		});

		await userModel.findByIdAndUpdate(user._id, { token }, { new: true });

		const response = {
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
				avatarURL: user.avatarURL
			},
		};

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

async function signOutUser(req, res, next) {
	try {
		await userModel.findByIdAndUpdate(req.user._id, { token: '' });

		return res.status(204).send();
	} catch (error) {
		next(error);
	}
}

async function getCurrentUser(req, res, next) {
	try {
		const { email, subscription, avatarURL } = req.user;

		return res.status(200).json({ email, subscription, avatarURL });
	} catch (error) {
		next(error);
	}
}

async function updateUserSubscription(req, res, next) {
	try {
		const {
			body: { subscription },
			user: { _id },
		} = req;

		const updatedUser = await userModel.findByIdAndUpdate(_id, { subscription }, { new: true });
		const response = { email: updatedUser.email, subscription: updatedUser.subscription };

		return res.status(200).send(response);
	} catch (error) {
		next(error);
	}
}

async function updateUsersAvatar(req, res, next) {
	try {
		const {
			file: { filename },
			user: { _id, avatarURL },
		} = req;

		const oldAvatar = path.parse(avatarURL).base;

		await fs.promises.unlink(process.env.STORAGE_DIR + oldAvatar);

		await imageCompressor(filename);

		const newAvatar = process.env.AVATAR_URL + filename;
		const updatedUser = await userModel.findByIdAndUpdate(
			_id,
			{ $set: { avatarURL: newAvatar } },
			{ new: true },
		);

		const response = { avatarURL: updatedUser.avatarURL };

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

export {
	singUpUser,
	signInUser,
	signOutUser,
	getCurrentUser,
	updateUserSubscription,
	updateUsersAvatar
};