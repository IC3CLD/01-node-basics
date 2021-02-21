import path from "path";
import AvatarGenerator from 'avatar-generator';
import { getPaths } from "./utils.js";

const { __dirname } = getPaths(import.meta.url);


async function avatarGen(next) {
	try {
		const avatar = new AvatarGenerator();

		const fileName = Date.now();
		const filePath = process.env.SOURCE_DIR + fileName + '.png';
		

		const image = await avatar.generate(null, 'male');
		await image.png().toFile(filePath);

		return `${fileName}.png`;
	} catch (error) {
		next(error);
	}
}

export default avatarGen;