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
        <Image src={product.image} alt={product.alt} width={800} height={600} />
      </div>
      <div className="card__body">
        <h3>{product.name}</h3>
        <p>{product.short}</p>
        <SpecLine items={spec} />
        <div className="card__foot">
          <Link
            className="btn btn--secondary btn--sm btn--block"
            href={`/products/${product.slug}`}
            style={{ marginTop: 12 }}
          >
            לפרטים והצעה
          </Link>
        </div>
      </div>
    </article>
  );
}
