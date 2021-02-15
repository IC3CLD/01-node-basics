import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	subscription: {
		type: String,
		enum: ['free', 'pro', 'premium'],
		required: false,
		default: 'free',
	},
	token: { type: String, required: false },
});

export const userModel = model('User', userSchema);