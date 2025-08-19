import config from '../../../config.json';
import fs from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

type EntityType = 'author' | 'book' | 'library';

export const saveImage = async (
	imageBuffer: Buffer,
	entityId: string,
	entityType: EntityType
): Promise<string> => {
	try {
		const assetsPath = config.assets;
		const entityPath = path.join(assetsPath, entityType);

		await fs.mkdir(entityPath, { recursive: true });

		const imagePath = path.join(entityPath, `${entityId}.webp`);
		const dimensions = {
			book: { width: 400, height: 600 },
			author: { width: 500, height: 500 },
			library: { width: 500, height: 300 }
		};

		const { width, height } = dimensions[entityType];

		await sharp(imageBuffer)
			.webp({ quality: 90 })
			.resize(width, height, {
				fit: 'cover',
				position: 'center'
			})
			.toFile(imagePath);

		return imagePath;
	} catch (error) {
		console.error('Error al guardar imagen:', error);
		throw new Error('Error al guardar imagen');
	}
};

export const deleteImage = async (entityId: string, entityType: EntityType): Promise<void> => {
	try {
		const assetsPath = config.assets;
		const imagePath = path.join(assetsPath, entityType, `${entityId}.webp`);

		try {
			await fs.access(imagePath);
			await fs.unlink(imagePath);
		} catch (error) {}
	} catch (error) {
		console.error('Error eliminando imagen:', error);
	}
};

export const processImageFromRequest = (imageData: any): Buffer | null => {
	if (!imageData) return null;

	try {
		if (Buffer.isBuffer(imageData)) {
			return imageData;
		}

		if (typeof imageData === 'string') {
			const base64Match = imageData.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/);
			if (base64Match) {
				return Buffer.from(base64Match[1], 'base64');
			}

			return Buffer.from(imageData, 'base64');
		}

		return null;
	} catch (error) {
		console.error('Error procesando imagen:', error);
		return null;
	}
};
