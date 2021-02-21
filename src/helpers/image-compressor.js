
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

async function imageCompressor(imageFile) {
	try {
		const SOURCE_DIR = process.env.SOURCE_DIR + imageFile;
        const COMPRESSED_DIR = process.env.STORAGE_DIR;
        
        const image = await Jimp.read(SOURCE_DIR);

    const compressedImagePath = path.join(COMPRESSED_DIR, imageFile);

    await image.resize(200, 200).quality(70).writeAsync(compressedImagePath);

		await fs.promises.unlink(SOURCE_DIR);
	} catch (error) {
		throw(error);
	}
}

export default imageCompressor;