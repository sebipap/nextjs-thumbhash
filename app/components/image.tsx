"use client";

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
