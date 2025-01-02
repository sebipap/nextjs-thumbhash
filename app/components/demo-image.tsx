"use client";
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

export default function DemoImage(props: ImageProps) {
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
}
