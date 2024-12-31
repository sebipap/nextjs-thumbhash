import { z } from 'zod'

import { generateThumbHash } from '@/lib/thumbhash'

const urlSchema = z.string().url()

export default async function GET(request: Request) {
  const url = new URL(request.url)
  const urlParam = url.searchParams.get('url')

  if (!urlParam) {
    return new Response('URL is required', { status: 400 })
  }

  const parsedUrl = urlSchema.safeParse(urlParam)
  if (!parsedUrl.success) {
    return new Response('Invalid URL', { status: 400 })
  }

  const image = await fetch(parsedUrl.data)
    .then((res) => res.arrayBuffer())
    .catch((e) => {
      console.error(e)
      return null
    })

  if (!image) {
    return new Response('Failed to fetch image', { status: 500 })
  }

  const thumbhash = await generateThumbHash(image)

  return new Response(
    JSON.stringify({
      thumbhash,
    }),
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000',
      },
    }
  )
}
