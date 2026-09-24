import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell, copy } from "@/components/Shell";
import { hexToRgb, rgbToHsl, hslToHex, isLight, randomHex, saveColor } from "@/lib/color";

export const Route = createFileRoute("/palettes")({
  head: () => ({
    meta: [
      { title: "Palette Generator — Chroma" },
      { name: "description", content: "Generate complementary, analogous, triadic and shade palettes from any color." },
      { property: "og:title", content: "Palette Generator — Chroma" },
      { property: "og:description", content: "Generate harmonious color palettes from any base color." },
    ],
  }),
  component: Palettes,
});

function build(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const H = (d: number) => (h + d + 360) % 360;
  return {
    Complementary: [hex, hslToHex(H(180), s, l), hslToHex(h, s, Math.min(l + 20, 95)), hslToHex(H(180), s, Math.max(l - 20, 5))],
    Analogous: [hslToHex(H(-40), s, l), hslToHex(H(-20), s, l), hex, hslToHex(H(20), s, l), hslToHex(H(40), s, l)],
    Triadic: [hex, hslToHex(H(120), s, l), hslToHex(H(240), s, l)],
    Shades: [90, 75, 60, 45, 30, 15].map((x) => hslToHex(h, s, x)),
  };
}

function Palettes() {
  const [base, setBase] = useState("#2f6f5e");
  const pals = build(base);
  return (
    <Shell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Palettes</h1>
          <p className="mt-2 text-muted-foreground">Harmonies generated from your base color. Click a swatch to copy.</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-12 w-12 cursor-pointer rounded-xl border border-border bg-transparent" />
          <span className="font-mono">{base.toUpperCase()}</span>
          <button onClick={() => setBase(randomHex())} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">Shuffle</button>
        </div>
      </div>
      <div className="mt-10 space-y-10">
        {Object.entries(pals).map(([name, colors]) => (
          <section key={name}>
            <h2 className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">{name}</h2>
            <div className="grid grid-cols-2 overflow-hidden rounded-3xl sm:flex">
              {colors.map((c, i) => (
                <div key={i} className="group relative h-28 flex-1 sm:h-40" style={{ background: c, color: isLight(c) ? "#111" : "#fff" }}>
                  <button onClick={() => { copy(c); toast.success(`Copied ${c}`); }} className="absolute inset-0 flex items-end p-3 font-mono text-sm">
                    {c.toUpperCase()}
                  </button>
                  <button onClick={() => { saveColor(c); toast.success("Saved"); }} className="absolute right-2 top-2 rounded-full border border-current px-2 py-0.5 text-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    + save
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
