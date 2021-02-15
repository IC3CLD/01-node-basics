import {userModel} from './user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function singUpUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const existUser = await userModel.findOne({ email });

		if (existUser) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const encryptedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
		const user = await userModel.create({ email, password: encryptedPassword });
		const response = { user: { email: user.email, subscription: user.subscription } };

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
		const { email, subscription } = req.user;

		return res.status(200).json({ email, subscription });
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

export {
	singUpUser,
	signInUser,
	signOutUser,
	getCurrentUser,
	updateUserSubscription,
};