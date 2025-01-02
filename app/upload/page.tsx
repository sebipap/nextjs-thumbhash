'use client'

import { useState } from 'react'
import { thumbHashToDataURL } from 'thumbhash'
import base64ToUint8Array from '../lib/base64ToUint8Array'

export default function UploadPage() {
  const [thumbhash, setThumbhash] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [codeSnippet, setCodeSnippet] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    setPreview(URL.createObjectURL(file))

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    // Upload and get thumbhash
    const response = await fetch('/api/generate-thumbhash', {
      method: 'POST',
      body: formData,
    })

    const { thumbhash: hash } = await response.json()
    setThumbhash(hash)

    // Generate code snippet
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
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
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
              className="max-w-full h-auto"
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
  )
} 