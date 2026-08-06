import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/site";

/**
 * next/image with the basePath applied.
 *
 * Next prefixes basePath via the image optimizer, but SVGs bypass the optimizer
 * (it refuses to process them), so their src is emitted verbatim — which 404s
 * whenever the app is served under a subpath like /DfusReuven.
 *
 * Use this everywhere instead of importing next/image directly.
 */
export default function Img({ src, ...rest }: ImageProps) {
  return <NextImage src={typeof src === "string" ? assetPath(src) : src} {...rest} />;
}
