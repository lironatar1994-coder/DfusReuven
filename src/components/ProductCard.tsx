import Image from "@/components/Img";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { formatShekels, getPricedProduct } from "@/data/pricing";
import { SpecLine } from "./ui";

export default function ProductCard({ product }: { product: Product }) {
  // The spec line is the job ticket: the two facts a print customer actually asks for.
  const spec = [product.materials[0], product.finishes[0]].filter(Boolean);

  // Real numbers where we have a rate table; the catalog placeholder otherwise.
  const priced = getPricedProduct(product.slug);
  const entry = priced?.tiers[0];

  return (
    <article className="card product-card">
      <div className="card__media">
        <Image src={product.image} alt={product.alt} width={800} height={600} />
      </div>
      <div className="card__body">
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        <SpecLine items={spec} />
        <div className="card__foot">
          <p className="price">
            {entry ? (
              <>
                {formatShekels(entry.min)}–{formatShekels(entry.max)}{" "}
                <small>ל-{entry.label}</small>
              </>
            ) : (
              <>
                {product.priceFrom} <small>{product.priceUnit}</small>
              </>
            )}
          </p>
          <Link
            className="btn btn--secondary btn--sm btn--block"
            href={`/products/${product.slug}`}
            style={{ marginTop: 12 }}
          >
            לפרטים ומחיר
          </Link>
        </div>
      </div>
    </article>
  );
}
