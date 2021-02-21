import multer from "multer";
import path from "path";
import { getPaths } from "./utils.js";

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'temp');
	},

	filename(req, file, cb) {
		const ext = path.parse(file.originalname).ext;
		cb(null, Date.now() + ext);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export default multer({
	storage,
	fileFilter,
});