import { rgbaToThumbHash } from 'thumbhash'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response('No file uploaded', { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const image = sharp(buffer)
    const { data, info } = await image
      .resize(100, 100, { fit: 'inside' })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true })

    const rgba = new Uint8Array(data)
    const thumbHash = rgbaToThumbHash(info.width, info.height, rgba)

    return Response.json({
      thumbhash: Buffer.from(thumbHash).toString('base64'),
      width: info.width,
      height: info.height,
    })
  } catch {
    return new Response('Error processing image', { status: 500 })
  }
}
