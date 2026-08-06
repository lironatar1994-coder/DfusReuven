"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  estimate,
  formatShekels,
  pricedProducts,
  VAT_RATE,
  type PricedProduct,
} from "@/data/pricing";

function defaultSelections(product: PricedProduct): Record<string, string> {
  return Object.fromEntries(product.options.map((g) => [g.id, g.choices[0].id]));
}

export default function Estimator({ lockedSlug }: { lockedSlug?: string }) {
  const initialProduct =
    pricedProducts.find((p) => p.slug === lockedSlug) ?? pricedProducts[0];

  const [product, setProduct] = useState<PricedProduct>(initialProduct);
  const [qty, setQty] = useState<number>(initialProduct.tiers[1]?.qty ?? initialProduct.tiers[0].qty);
  const [selections, setSelections] = useState<Record<string, string>>(
    defaultSelections(initialProduct),
  );
  const [withVat, setWithVat] = useState(false);

  const range = useMemo(() => estimate(product, qty, selections), [product, qty, selections]);

  const switchProduct = (slug: string) => {
    const next = pricedProducts.find((p) => p.slug === slug);
    if (!next) return;
    setProduct(next);
    setQty(next.tiers[1]?.qty ?? next.tiers[0].qty);
    setSelections(defaultSelections(next));
  };

  const shown = range
    ? withVat
      ? { min: Math.round(range.min * (1 + VAT_RATE)), max: Math.round(range.max * (1 + VAT_RATE)) }
      : range
    : null;

  // Hand the whole spec to the quote form so nothing is retyped.
  const specText = product.options
    .map((g) => g.choices.find((c) => c.id === selections[g.id])?.label)
    .filter(Boolean)
    .join(" · ");

  const qtyLabel = product.tiers.find((t) => t.qty === qty)?.label ?? String(qty);

  // Always hand over the ex-VAT figure — that is how the quote form labels it,
  // regardless of which way the VAT toggle happens to be sitting.
  const quoteHref =
    `/quote?product=${encodeURIComponent(product.label)}` +
    `&qty=${encodeURIComponent(qtyLabel)}` +
    `&spec=${encodeURIComponent(specText)}` +
    (range ? `&est=${encodeURIComponent(`${formatShekels(range.min)}–${formatShekels(range.max)}`)}` : "");

  return (
    <div className="estimator">
      <div className="estimator__controls">
        {!lockedSlug && (
          <div className="field">
            <label htmlFor="est-product">מה מדפיסים?</label>
            <select
              id="est-product"
              value={product.slug}
              onChange={(e) => switchProduct(e.target.value)}
            >
              {pricedProducts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <fieldset className="est-group">
          <legend className="field__legend">כמות</legend>
          <div className="chips-row">
            {product.tiers.map((tier) => (
              <label className="chip-radio" key={tier.qty}>
                <input
                  type="radio"
                  name="est-qty"
                  checked={qty === tier.qty}
                  onChange={() => setQty(tier.qty)}
                />
                <span>{tier.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {product.options.map((group) => (
          <fieldset className="est-group" key={group.id}>
            <legend className="field__legend">{group.label}</legend>
            <div className="chips-row">
              {group.choices.map((choice) => (
                <label className="chip-radio" key={choice.id}>
                  <input
                    type="radio"
                    name={`est-${group.id}`}
                    checked={selections[group.id] === choice.id}
                    onChange={() =>
                      setSelections((prev) => ({ ...prev, [group.id]: choice.id }))
                    }
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="estimator__result" aria-live="polite">
        <span className="estimator__label">הערכת מחיר</span>
        <strong className="estimator__price">
          {shown ? `${formatShekels(shown.min)} – ${formatShekels(shown.max)}` : "—"}
        </strong>
        <span className="estimator__meta">
          {qtyLabel}
          {specText ? ` · ${specText}` : ""}
        </span>

        <div className="estimator__vat">
          <label className="chip-radio">
            <input type="radio" name="est-vat" checked={!withVat} onChange={() => setWithVat(false)} />
            <span>לא כולל מע״מ</span>
          </label>
          <label className="chip-radio">
            <input type="radio" name="est-vat" checked={withVat} onChange={() => setWithVat(true)} />
            <span>כולל מע״מ</span>
          </label>
        </div>

        <Link className="btn btn--primary btn--block" href={quoteHref}>
          קבלו הצעה מדויקת
        </Link>
        <p className="estimator__note">
          זו הערכה בלבד ואינה מהווה הצעת מחיר מחייבת. המחיר הסופי נקבע לאחר בדיקת הקובץ
          והמפרט המלא.
        </p>
      </div>
    </div>
  );
}
