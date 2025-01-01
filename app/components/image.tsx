"use client";
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { thumbHashToDataURL } from "thumbhash";
import base64ToUint8Array from "../lib/base64ToUint8Array";

type ImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function Image(props: ImageProps) {
  const [thumbhash, setThumbhash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThumbhash() {
      const response = await fetch(
        "/api/thumbhash?url=" + encodeURIComponent(props.src ?? ""),
        { method: "GET", cache: "force-cache" }
      );
      const data = await response.json();
      setThumbhash(data.thumbhash);
    }
    fetchThumbhash();
  }, [props.src]);

  return (
    <div className="relative h-full w-full">
      {loading && thumbhash && (
        <img
          {...props}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-1",
            props.className
          )}
          src={thumbHashToDataURL(base64ToUint8Array(thumbhash))}
        />
      )}
      <img
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 z-2 opacity-100",
          loading && "opacity-0",
          props.className
        )}
        {...props}
        ref={(img) => {
          if (img?.complete) {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
