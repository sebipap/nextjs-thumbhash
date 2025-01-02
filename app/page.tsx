import Link from 'next/link'
import { CodeSnippet } from './components/code-snippet'
import DemoImage from './components/demo-image'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const images = [
    `https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=${q}`,
    `https://images.unsplash.com/photo-1682687981674-0927add86f2b?q=${q}`,
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=${q}`,
    `https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=${q}`,
  ]

  return (
    <>
      <div className="min-h-screen text-black">
        <div className="h-screen w-full grid grid-cols-2 grid-rows-2 relative">
          {images.map((image, index) => (
            <DemoImage
              key={image}
              src={image}
              alt={`Example image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
          <form
            action=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 font-mono flex flex-col gap-4"
          >
            <h1 className="text-2xl">nextjs-thumbhash</h1>
            <p>
              A ready to use{' '}
              <Link
                className="underline"
                href="https://evanw.github.io/thumbhash/"
              >
                ThumbHash
              </Link>{' '}
              implementation for{' '}
              <Link className="underline" href="https://nextjs.org">
                Next.JS
              </Link>
              .<br /> Show a placeholder while images are loading to avoid
              layout shift.
            </p>
            <button
              type="submit"
              className="p-2 bg-black text-white rounded-md"
            >
              Reload to see the magic ✨
            </button>
            <input
              name="q"
              type="hidden"
              value={(Number((q as string) ?? 0) + 1).toString()}
            />
          </form>
        </div>
      </div>
      <div>
        <div className="max-w-3xl mx-auto">
          <section className="mb-12 mt-8">
            <h2 className="text-xl font-bold mb-4">Installation</h2>
            <div className="mb-6">
              <p className="mb-4">
                1. Install{' '}
                <Link
                  className="underline"
                  href="https://evanw.github.io/thumbhash/"
                >
                  ThumbHash
                </Link>{' '}
              </p>
              <CodeSnippet
                language="bash"
                code="npm install thumbhash"
              />
            </div>

            <div className="mb-6">
              <p className="mb-4">2. Copy these files into your project:</p>
              <ul className="list-disc">
                <h3 className="text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  components/image.tsx
                </h3>
                <CodeSnippet
                  code={`"use client";

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
}
`}
                />
                <h3 className="mt-4 text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  lib/base64ToUint8Array.ts
                </h3>
                <CodeSnippet
                  code={`export default function base64ToUint8Array(base64: string): Uint8Array {
  const decodedString = atob(base64);
  const arrayBuffer = new Uint8Array(decodedString.length);

  for (let i = 0; i < decodedString.length; i++) {
    arrayBuffer[i] = decodedString.charCodeAt(i);
  }

  return arrayBuffer;
}`}
                />
                <h3 className="mt-4 text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  lib/thumbhash.ts
                </h3>
                <CodeSnippet
                  code={`import sharp from 'sharp';
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
}
`}
                />
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Usage</h2>
            <div className="mb-6">
              <p className="mb-4 mt-4">
                1. Generate a thumbhash for your image:
              </p>
              <CodeSnippet
                code={`import { generateThumbHash } from '@/lib/generateThumbHash';

// During image upload
async function handleImageUpload(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const thumbhash = await generateThumbHash(arrayBuffer);
  
  // Store thumbhash in your database
  await saveToDatabase({
    imageUrl: 'https://example.com/image.jpg',
    thumbhash: thumbhash
  });
}`}
              />
            </div>

            <div className="mb-6">
              <p className="mb-4">2. Use the Image component:</p>
              <CodeSnippet
                code={`import Image from '@/components/Image';

export default function MyPage() {
  return (
    <Image
      src="https://example.com/my-image.jpg"
      thumbhash="YOUR_STORED_THUMBHASH"
      alt="Description"
      className="w-full h-64"
    />
  );
}`}
              />
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-bold mb-4">How it Works</h2>
            <ol className="list-decimal p-4">
              <li className="mb-2">
                When the component mounts, it shows a low-resolution placeholder
                generated from the thumbhash
              </li>
              <li className="mb-2">The main image loads in the background</li>
              <li className="mb-2">
                Once loaded, the main image fades in smoothly while the
                placeholder fades out
              </li>
              <li className="mb-2">
                The placeholder is removed from the DOM after the transition
              </li>
            </ol>
          </section>
          <section className="mb-4">
            <h2 className="text-xl font-bold">Requirements</h2>
            <ul className="list-disc p-4">
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>TypeScript</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold">Notes</h2>
            <ul className="list-disc p-4">
              <li className="mb-2">
                ThumbHash strings are typically very small (30-100 bytes)
              </li>
              <li className="mb-2">
                Store thumbhashes in your database alongside image URLs or
                hardcode them if they are static
              </li>
              <li className="mb-2">
                The component uses Tailwind CSS for styling
              </li>
              <li className="mb-2">
                {` The component is marked with "use client" as it uses browser
                APIs`}
              </li>
            </ul>
          </section>
        </div>
      </div>
      <footer className="max-w-3xl mx-auto py-8 flex justify-between">
        <p>
          Made with ❤️ by{' '}
          <Link className="underline" href="https://nicolasmontone.com">
            monto
          </Link>{' '}
          and{' '}
          <Link className="underline" href="https://sebastianpapanicolau.com">
            papa
          </Link>
        </p>
        <Link
          href="https://github.com/sebipap/nextjs-thumbhash"
          className="flex items-center gap-2 hover:underline"
        >
          <svg
            height="15"
            width="15"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          source ode
        </Link>
      </footer>
    </>
  )
}
