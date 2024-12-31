import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";


export async function generateThumbHash(arrayBuffer: ArrayBuffer) {
	const buffer = Buffer.from(arrayBuffer);
	const sharpImage = sharp(buffer).ensureAlpha();
	const resizedImage = sharpImage.resize(100, 100, {
		fit: 'inside',
		withoutEnlargement: true
	});

	const { data, info } = await resizedImage
		.raw()
		.toBuffer({ resolveWithObject: true });

	const rgba = new Uint8Array(data);
	const thumbHashUint8Array = rgbaToThumbHash(info.width, info.height, rgba);
	const thumbHashBase64 = Buffer.from(thumbHashUint8Array).toString("base64");
	return thumbHashBase64;

}
