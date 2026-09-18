"use client";

import { CATEGORY_LABEL, type ProductCategory } from "@/lib/types";

export type CategoryFilter = ProductCategory | "all";

// The category filter chips. One component so the storefront grid and the admin
// dashboard stay identical: "ทั้งหมด" always comes first, then the categories in
// the order the admin picked in the category-order panel. Each label is a short
// phrase, so nowrap inside the wrapping row is safe (see handoff: Thai breaks).
// Plain toggle buttons (aria-pressed), not tabs — there is no tabpanel and no
// arrow-key roving, so tab semantics would promise keyboard behaviour we lack.
export default function CategoryChips({
  order,
  value,
  onChange,
  label = "กรองตามหมวด",
}: {
  order: ProductCategory[];
  value: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {(["all", ...order] as CategoryFilter[]).map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={value === c}
          onClick={() => onChange(c)}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
            value === c
              ? "border-pink bg-pink/15 text-pink-soft"
              : "border-line bg-surface text-muted hover:border-pink/40 hover:text-ink"
          }`}
        >
          {c === "all" ? "ทั้งหมด" : CATEGORY_LABEL[c]}
        </button>
      ))}
    </div>
  );
}
