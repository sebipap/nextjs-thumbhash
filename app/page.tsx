'use client'

import { useState, use } from 'react'
import Image from './components/image'
import { thumbHashToDataURL } from 'thumbhash'
import base64ToUint8Array from './lib/base64ToUint8Array'

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = use(searchParams)

  const [thumbhash, setThumbhash] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [codeSnippet, setCodeSnippet] = useState<string | null>(null)

  const images = [
    `https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=${q}`,
    `https://images.unsplash.com/photo-1682687981674-0927add86f2b?q=${q}`,
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=${q}`,
    `https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=${q}`,
  ]

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/generate-thumbhash', {
      method: 'POST',
      body: formData,
    })

    const { thumbhash: hash } = await response.json()
    setThumbhash(hash)

    const snippet = `// Install thumbhash: npm install thumbhash
import { thumbHashToDataURL } from 'thumbhash'

// Your thumbhash (base64)
const thumbhash = "${hash}"

// Convert base64 to Uint8Array
const thumbhashArray = Uint8Array.from(atob(thumbhash), c => c.charCodeAt(0))

// Generate data URL for the placeholder
const placeholderUrl = thumbHashToDataURL(thumbhashArray)

// Use in your img tag
<img src={placeholderUrl} />`

    setCodeSnippet(snippet)
  }

  return (
    <div className="min-h-screen text-black">
      {/* Upload Section */}
      <div className="p-8 max-w-3xl mx-auto border-b">
        <h1 className="text-2xl font-bold mb-8">Generate Thumbhash</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-8 block"
        />

        <div className="grid grid-cols-2 gap-8 mb-8">
          {preview && (
            <div>
              <h2 className="font-bold mb-2">Original Image</h2>
              <img src={preview} className="max-w-full h-auto" alt="Original" />
            </div>
          )}

          {thumbhash && (
            <div>
              <h2 className="font-bold mb-2">Thumbhash Preview</h2>
              <img
                src={thumbHashToDataURL(base64ToUint8Array(thumbhash))}
                className="max-w-full h-full w-full"
                alt="Thumbhash preview"
              />
            </div>
          )}
        </div>

        {thumbhash && (
          <div>
            <h2 className="font-bold mb-2">Your Thumbhash (base64)</h2>
            <pre className="bg-gray-100 p-4 rounded mb-8 overflow-x-auto">
              {thumbhash}
            </pre>
          </div>
        )}

        {codeSnippet && (
          <div>
            <h2 className="font-bold mb-2">Code Snippet</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {codeSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Demo Gallery Section */}
      <div className="h-screen w-full grid grid-cols-2 grid-rows-2 relative">
        {images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`Example image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ))}

        <form
          action=""
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <button type="submit" className="p-2 bg-white text-black rounded-md">
            Reload
          </button>
          <input
            name="q"
            type="hidden"
            value={(Number((q as string) ?? 0) + 1).toString()}
          />
        </form>
      </div>
    </div>
  )
}
