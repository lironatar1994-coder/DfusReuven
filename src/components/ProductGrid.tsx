"use client";

import { useState } from "react";
import { categories, type Product } from "@/data/catalog";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<string>("all");
  const visible = products.filter((p) => filter === "all" || p.category === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="סינון מוצרים לפי קטגוריה">
        {categories
          .filter((cat) => cat.key !== "design")
          .map((cat) => (
            <button
              key={cat.key}
              className="filter"
              type="button"
              aria-pressed={filter === cat.key}
              onClick={() => setFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
      </div>

      <div className="grid grid--4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)" }}>
          אין מוצרים בקטגוריה הזו כרגע. נסו קטגוריה אחרת.
        </p>
      ) : null}
    </>
  );
}
