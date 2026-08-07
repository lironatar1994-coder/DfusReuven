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
          sizes="(min-width: 1024px) 23vw, 240px"
        />
      </div>
      <div className="card__body">
        {/* The whole card is the target now. It used to end in a full-width
            outlined button repeated in every card — on the homepage that was
            eight identical CTAs, half of every button on the page, all saying
            the same thing and all going somewhere different. The link now sits
            on the product name (so a screen-reader link list reads twelve
            product names instead of "לפרטים והצעה" twelve times) and stretches
            over the card via ::after, which is also a far bigger tap target
            than the button ever was. */}
        <h3>
          <Link className="card__link" href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p>{product.short}</p>
        <SpecLine items={spec} />
        {/* A blue chevron used to sit here. Six cards meant six identical
            arrows pointing at six things that were already entirely clickable —
            affordance repeated past the point where it informs. */}
      </div>
    </article>
  );
}
