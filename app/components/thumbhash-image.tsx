/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from 'react'

import { thumbHashToDataURL } from 'thumbhash'
import { cn } from '../lib/cn'

import base64ToUint8Array from '../lib/base64ToUint8Array'

type ImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

type Props = ImageProps & { thumbhash: string | null }

type Src = string
type Thumbhash = string

const kv: Record<Src, Thumbhash> = {}

function Image(props: ImageProps) {
  const [thumbhash, setThumbhash] = useState<Thumbhash | null>(null)

  useEffect(() => {
    async function x() {
      if (!props.src) return
      const thumbhash = kv[props.src]
      if (thumbhash) {
        setThumbhash(thumbhash)
      } else {
        const response = await fetch(props.src)
        const arrayBuffer = await response.arrayBuffer()
        const b64 = await generateThumbHash(arrayBuffer)
        kv[props.src] = b64
        setThumbhash(b64)
      }
    }
    x()
  }, [props.src])

  return <ThumbhashImage {...props} thumbhash={thumbhash} />
}

export const ThumbhashImage = ({
  thumbhash,
  className,
  ...imageProps
}: Props) => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative h-full w-full">
      {loading && thumbhash && (
        <img
          {...imageProps}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-1',
            className
          )}
          src={thumbHashToDataURL(base64ToUint8Array(thumbhash))}
        />
      )}
      <img
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-2 opacity-100',
          loading && 'opacity-0',
          className
        )}
        {...imageProps}
        ref={(img) => {
          if (img?.complete) {
            setLoading(false)
          }
        }}
      />
    </div>
  )
}
