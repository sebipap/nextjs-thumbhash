"use client";
import Link from "next/link";
import { CodeSnippet } from "./components/code-snippet";
import DynamicImage from "./components/dynamic-image";
import { use, useState } from "react";
import { CODE_SNIPPETS } from "./constants/code-snippets";
import { Playground } from "./components/playground";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = use(searchParams);

  const images = [
    `https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=${q}`,
    `https://images.unsplash.com/photo-1682687981674-0927add86f2b?q=${q}`,
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=${q}`,
    `https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=${q}`,
  ];

  const [thumbHash, setThumbHash] = useState<string | null>(null);

  const onCreate = (thumbHash: string) => {
    setThumbHash(thumbHash);
  };

  return (
    <>
      <div className="min-h-screen text-black">
        <div className="h-screen w-full grid grid-cols-2 grid-rows-2 relative">
          {images.map((image, index) => (
            <DynamicImage
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
              A ready to use{" "}
              <Link
                className="underline"
                href="https://evanw.github.io/thumbhash/"
              >
                ThumbHash
              </Link>{" "}
              implementation for{" "}
              <Link className="underline" href="https://nextjs.org">
                Next.JS
              </Link>
              .<br /> Show a placeholder while images are loading to avoid
              layout shift.
            </p>
            <div className="flex gap-2">
              <button
                type="submit"
                className="p-2 bg-black text-white rounded-md flex-1"
              >
                Reload to see the magic ✨
              </button>
              <button
                type="button"
                className="flex-1 border-2 border-black rounded-md"
                onClick={() => {
                  document.querySelector("#installation")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Check out docs
              </button>
            </div>
            <input
              name="q"
              type="hidden"
              value={(Number((q as string) ?? 0) + 1).toString()}
            />
          </form>
        </div>
      </div>
      <div id="installation">
        <div className="max-w-3xl mx-auto">
          <section className="mb-12 mt-8">
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <div className="mb-6">
              <p className="mb-4">1. Install dependencies</p>
              <CodeSnippet
                language="bash"
                code={CODE_SNIPPETS.INSTALL_DEPENDENCIES}
              />
            </div>

            <div className="mb-6">
              <p className="mb-4">2. Copy these files into your project:</p>
              <ul className="list-disc">
                <h3 className="text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  components/image.tsx
                </h3>
                <CodeSnippet code={CODE_SNIPPETS.IMAGE_COMPONENT} />
                <h3 className="mt-4 text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  lib/base64ToUint8Array.ts
                </h3>
                <CodeSnippet code={CODE_SNIPPETS.BASE64_TO_UINT8_ARRAY} />
                <h3 className="mt-4 text-md p-2 bg-gray-900 w-fit rounded-t-md font-semibold font-mono">
                  lib/thumbhash.ts
                </h3>
                <CodeSnippet code={CODE_SNIPPETS.THUMBHASH_LIB} />
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Usage</h2>
            <p className="mb-4">Depending on your needs, you can either:</p>
            <h3 className="text-lg font-semibold mb-2">
              Option 1: Save ThumbHash in the DB
            </h3>
            <p>
              {`Here, you'll save the thumbhash in your database alongside the
              image URL. This is useful when you're already controlling the
              image URLs in your database.`}
            </p>
            <div className="mb-6">
              <p className="mb-4 mt-4">
                1. Generate a thumbhash for your image:
              </p>
              <CodeSnippet code={CODE_SNIPPETS.GENERATE_THUMBHASH} />
            </div>

            <div className="mb-6">
              <p className="mb-4">2. Use the Image component:</p>
              <CodeSnippet code={CODE_SNIPPETS.USE_IMAGE_COMPONENT} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Option 2: Use it with static images, with hardcoded thumbhashes
            </h3>
            <div className="mb-6 flex flex-col gap-4">
              <Playground onCreate={onCreate} />
              <CodeSnippet code={CODE_SNIPPETS.HARDCODED_THUMBHASH(thumbHash)} />
            </div>
            <p className="mb-4">
              {` Here, you'll hardcode the thumbhash in your component. This is
              useful when you're using static images like a landing page.`}
            </p>
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
        </div>
      </div>
      <footer className="max-w-3xl mx-auto py-8 flex justify-between">
        <p>
          Made with ❤️ by{" "}
          <Link className="underline" href="https://nicolasmontone.com">
            monto
          </Link>{" "}
          and{" "}
          <Link className="underline" href="https://github.com/sebipap">
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
          source code
        </Link>
      </footer>
    </>
  );
}
