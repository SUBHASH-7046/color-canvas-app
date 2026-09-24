import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell, copy } from "@/components/Shell";
import { hexToRgb, rgbToHex, rgbToHsl, isLight, randomHex, saveColor } from "@/lib/color";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chroma — Color Picker" },
      { name: "description", content: "Pick any color and get HEX, RGB and HSL values instantly." },
      { property: "og:title", content: "Chroma — Color Picker" },
      { property: "og:description", content: "Pick any color and get HEX, RGB and HSL values instantly." },
    ],
  }),
  component: Picker,
});

function Picker() {
  const [hex, setHex] = useState("#e8553d");
  const [input, setInput] = useState("#e8553d");
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const light = isLight(hex);

  const update = (h: string) => { setHex(h); setInput(h); };
  const setChannel = (k: "r" | "g" | "b", v: number) => update(rgbToHex(k === "r" ? v : rgb.r, k === "g" ? v : rgb.g, k === "b" ? v : rgb.b));

  const formats: [string, string][] = [
    ["HEX", hex.toUpperCase()],
    ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
    ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
  ];

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div
          className="relative flex min-h-[320px] flex-col justify-between rounded-3xl p-6 transition-colors sm:min-h-[460px] sm:p-8"
          style={{ background: hex, color: light ? "#111" : "#fff" }}
        >
          <span className="text-sm uppercase tracking-widest opacity-70">Current color</span>
          <div>
            <p className="font-display text-5xl sm:text-7xl">{hex.toUpperCase()}</p>
            <p className="mt-2 opacity-80">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
          </div>
          <label className="absolute right-6 top-6 cursor-pointer rounded-full border-2 border-current px-4 py-2 text-sm font-medium">
            Open picker
            <input type="color" value={hex} onChange={(e) => update(e.target.value)} className="sr-only" />
          </label>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border p-6">
            <label className="text-sm text-muted-foreground">Type a HEX code</label>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (/^#?[0-9a-fA-F]{6}$/.test(e.target.value)) setHex("#" + e.target.value.replace("#", "").toLowerCase());
              }}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-lg outline-none focus:border-primary"
            />
            <div className="mt-6 space-y-4">
              {(["r", "g", "b"] as const).map((k) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-4 font-mono text-sm uppercase">{k}</span>
                  <input type="range" min={0} max={255} value={rgb[k]} onChange={(e) => setChannel(k, +e.target.value)} className="flex-1 accent-primary" />
                  <span className="w-10 text-right font-mono text-sm">{rgb[k]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border p-2">
            {formats.map(([k, v]) => (
              <button
                key={k}
                onClick={() => { copy(v); toast.success(`Copied ${v}`); }}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="text-sm text-muted-foreground">{k}</span>
                <span className="font-mono text-sm sm:text-base">{v}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => update(randomHex())} className="flex-1 rounded-full border border-border px-4 py-3 font-medium hover:bg-muted">
              Random
            </button>
            <button onClick={() => { saveColor(hex); toast.success("Saved to your collection"); }} className="flex-1 rounded-full bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90">
              Save color
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
