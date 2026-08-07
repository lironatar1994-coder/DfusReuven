import Image from "@/components/Img";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { SpecLine } from "./ui";

export default function ProductCard({ product }: { product: Product }) {
  // The spec line is the job ticket: the two facts a print customer actually asks for.
  const spec = [product.materials[0], product.finishes[0]].filter(Boolean);

  return (
    <article className="card product-card">
      <div className="card__media">
        {/* Cards are two-up until 1024px and four-up above it, but with no
            `sizes` hint every card was served the 828px file for a ~172px slot
            on a phone — nine images at roughly four times the pixels needed. */}
        <Image
          src={product.image}
          alt={product.alt}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 23vw, 47vw"
        />
      </div>
      <div className="card__body">
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        <SpecLine items={spec} />
        <div className="card__foot">
          {/* A screen reader listing this page's links got "לפרטים והצעה"
              twelve times over. The visible label stays short; the accessible
              one names the product. */}
          <Link
            className="btn btn--secondary btn--sm btn--block"
            href={`/products/${product.slug}`}
            aria-label={`${product.name} — לפרטים והצעה`}
            style={{ marginTop: 12 }}
          >
            לפרטים והצעה
          </Link>
        </div>
      </div>
    </article>
  );
}
