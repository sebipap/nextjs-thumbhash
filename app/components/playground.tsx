'use client'

import { useCallback, useRef, useState } from 'react'
import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash'

export function Playground({
  onCreate,
}: {
  onCreate: (thumbHash: string) => void
}) {
  const [thumbHashPreview, setThumbHashPreview] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateThumbHash = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Generate ThumbHash
    const hash = rgbaToThumbHash(canvas.width, canvas.height, imageData.data)
    const base64Hash = Buffer.from(hash).toString('base64')
    const dataUrl = thumbHashToDataURL(hash)

    return { hash: base64Hash, preview: dataUrl }
  }, [])

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Display original image
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string

        // Draw image on canvas
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.onload = () => {
            // Calculate dimensions maintaining aspect ratio
            const MAX_SIZE = 200
            const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height)
            const newWidth = Math.round(img.width * scale)
            const newHeight = Math.round(img.height * scale)

            // Set canvas size for display
            canvas.width = newWidth
            canvas.height = newHeight
            canvas.style.width = `${newWidth}px`
            canvas.style.height = `${newHeight}px`
            ctx?.drawImage(img, 0, 0, newWidth, newHeight)

            // Generate ThumbHash (using smaller size)
            const thumbCanvas = document.createElement('canvas')
            const thumbCtx = thumbCanvas.getContext('2d')
            if (thumbCtx) {
              const THUMB_MAX_SIZE = 100
              const thumbScale = Math.min(
                THUMB_MAX_SIZE / img.width,
                THUMB_MAX_SIZE / img.height
              )
              const thumbWidth = Math.round(img.width * thumbScale)
              const thumbHeight = Math.round(img.height * thumbScale)

              thumbCanvas.width = thumbWidth
              thumbCanvas.height = thumbHeight
              thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight)

              const result = generateThumbHash(thumbCanvas)
              if (result) {
                setThumbHashPreview(result.preview)
                onCreate(result.hash)
              }
            }
          }
          img.src = dataUrl
        }
      }
      reader.readAsDataURL(file)
    },
    [generateThumbHash, onCreate]
  )

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-black
            hover:file:bg-gray-100 cursor-pointer"
        />
      </div>

      <div className="flex flex-row gap-4">
        <div>
          <h3 className="font-medium mb-2">Original Image</h3>
          <div className="border border-gray-200 rounded-md p-2 flex items-center justify-center w-[200px] h-[200px]">
            <canvas
              ref={canvasRef}
              className="rounded-md w-full h-full object-contain"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">ThumbHash Preview</h3>
          <div className="border border-gray-200 rounded-md p-2 flex items-center justify-center w-[200px] h-[200px]">
            {thumbHashPreview && (
              <img
                src={thumbHashPreview}
                alt="ThumbHash Preview"
                className="rounded-md w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
