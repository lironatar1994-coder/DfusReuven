"use client";

import Image from "@/components/Img";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/catalog";
import type { PortfolioItem } from "@/data/content";

export default function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible = items.filter((item) => filter === "all" || item.category === filter);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", Boolean(active));
    return () => document.body.classList.remove("no-scroll");
  }, [active]);

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const close = () => {
    setActive(null);
    openerRef.current?.focus();
  };

  return (
    <>
      <div className="filters" role="group" aria-label="סינון תיק העבודות לפי קטגוריה">
        {categories.map((cat) => (
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

      <div className="gallery">
        {visible.map((item) => (
          <button
            key={item.id}
            className={`gallery__item${item.tall ? " tall" : ""}`}
            type="button"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setActive(item);
            }}
          >
            <Image src={item.image} alt={item.alt} width={800} height={600} />
            <span className="gallery__cap">
              <strong>{item.title}</strong>
              <span>{item.categoryLabel}</span>
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)" }}>
          אין עבודות בקטגוריה הזו כרגע. נסו קטגוריה אחרת.
        </p>
      ) : null}

      {active ? (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lb-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="lightbox__box">
            <button ref={closeRef} className="lightbox__close" type="button" aria-label="סגירת התצוגה" onClick={close}>
              ✕
            </button>
            <Image src={active.image} alt={active.alt} width={800} height={600} />
            <div className="lightbox__info">
              <div className="marker">
                <span className="marker__label">{active.categoryLabel}</span>
              </div>
              <h3 id="lb-title">{active.title}</h3>
              <p>{active.description}</p>
              <ul className="lightbox__specs">
                {active.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <Link className="btn btn--primary btn--sm" href="/quote" onClick={close}>
                רוצים משהו דומה? קבלו הצעה
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
