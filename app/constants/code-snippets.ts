export const CODE_SNIPPETS = {
  INSTALL_DEPENDENCIES: 'npm install thumbhash sharp',

  IMAGE_COMPONENT: `"use client";

import { DetailedHTMLProps, ImgHTMLAttributes, useState } from "react";
import { thumbHashToDataURL } from "thumbhash";
import base64ToUint8Array from "@/app/lib/base64ToUint8Array";
import { cn } from "@/app/lib/cn";

export type ImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function Image({
  thumbhash,
  ...props
}: ImageProps & { thumbhash: string | null }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {loading && thumbhash && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img
          {...props}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-1",
            props.className
          )}
          src={thumbHashToDataURL(base64ToUint8Array(thumbhash))}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        {...props}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-2 opacity-100",
          loading && "opacity-0",
          props.className
        )}
        onLoad={(event) => {
          setLoading(false);
          props.onLoad?.(event);
        }}
        ref={(img) => {
          if (img?.complete) {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}`,

  BASE64_TO_UINT8_ARRAY: `export default function base64ToUint8Array(base64: string): Uint8Array {
  const decodedString = atob(base64);
  const arrayBuffer = new Uint8Array(decodedString.length);

  for (let i = 0; i < decodedString.length; i++) {
    arrayBuffer[i] = decodedString.charCodeAt(i);
  }

  return arrayBuffer;
}`,

  THUMBHASH_LIB: `import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';

export async function generateThumbHash(arrayBuffer: ArrayBuffer) {
	const buffer = Buffer.from(arrayBuffer);
	const sharpImage = sharp(buffer).ensureAlpha();
	const resizedImage = sharpImage.resize(100, 100, {
		fit: 'inside',
		withoutEnlargement: true,
	});

	const { data, info } = await resizedImage.raw().toBuffer({ resolveWithObject: true });

	const rgba = new Uint8Array(data);
	const thumbHashUint8Array = rgbaToThumbHash(info.width, info.height, rgba);
	const thumbHashBase64 = Buffer.from(thumbHashUint8Array).toString('base64');
	return thumbHashBase64;
}

export default function base64ToUint8Array(base64: string): Uint8Array {
	const decodedString = atob(base64);
	const arrayBuffer = new Uint8Array(decodedString.length);

	for (let i = 0; i < decodedString.length; i++) {
		arrayBuffer[i] = decodedString.charCodeAt(i);
	}

	return arrayBuffer;
}`,

  GENERATE_THUMBHASH: `import { generateThumbHash } from '@/lib/generateThumbHash';

// During image upload
async function handleImageUpload(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const imageUrl = await uploadImage(file);
  const thumbhash = await generateThumbHash(arrayBuffer);
  
  // Store thumbhash in your database
  await saveToDatabase({
    imageUrl,
    thumbhash
  });
}`,

  USE_IMAGE_COMPONENT: `import Image from '@/components/Image';

export default async function Page() {
  const { imageUrl, thumbhash } = await getFromDatabase();

  return (
    <Image
      src={imageUrl}
      thumbhash={thumbhash}
      alt="Description"
    />
  );
}`,

  DYNAMIC_IMAGE_COMPONENT: `"use client";
import {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from "react";
import Image from "@/app/components/image";

export type ImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function DynamicImage(props: ImageProps) {
  const [thumbhash, setThumbhash] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThumbhash() {
      const url = new URL(props.src ?? "");

      const response = await fetch(
        "/api/thumbhash?url=" + encodeURIComponent(url.origin + url.pathname),
        { method: "GET", cache: "force-cache" }
      );
      const data = await response.json();
      setThumbhash(data.thumbhash);
    }
    fetchThumbhash();
  }, [props.src]);

  return <Image {...props} thumbhash={thumbhash} alt={props.alt} />;
}`,
  API_ROUTE: `
import { generateThumbHash } from '@/lib/generateThumbhash'
import { z } from 'zod'

const urlSchema = z.string().url()

export async function GET(request: Request) {
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
}`,

  HARDCODED_THUMBHASH: (
    thumbhash: string | null
  ) => `import Image from '@/components/Image';

export default async function Page() {
  const { imageUrl, thumbhash } = await getFromDatabase();

  return (
    <Image
      src={imageUrl}
      thumbhash={${`'${thumbhash ?? 'YOUR_THUMBHASH'}'`}}
      alt="Description"
    />
  );
}`,
}
