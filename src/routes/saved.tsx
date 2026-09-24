import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell, copy } from "@/components/Shell";
import { getSaved, setSaved, isLight } from "@/lib/color";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Colors — Chroma" },
      { name: "description", content: "Your personal collection of saved colors." },
      { property: "og:title", content: "Saved Colors — Chroma" },
      { property: "og:description", content: "Your personal collection of saved colors." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => setList(getSaved()), []);
  const remove = (c: string) => { const n = list.filter((x) => x !== c); setList(n); setSaved(n); };

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Saved</h1>
          <p className="mt-2 text-muted-foreground">{list.length} colors in your collection.</p>
        </div>
        {list.length > 0 && (
          <button onClick={() => { setList([]); setSaved([]); }} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">Clear all</button>
        )}
      </div>
      {list.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No saved colors yet.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-primary-foreground">Pick a color</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((c) => (
            <div key={c} className="overflow-hidden rounded-2xl border border-border">
              <button onClick={() => { copy(c); toast.success(`Copied ${c}`); }} className="flex h-28 w-full items-end p-3 font-mono text-sm" style={{ background: c, color: isLight(c) ? "#111" : "#fff" }}>
                {c.toUpperCase()}
              </button>
              <button onClick={() => remove(c)} className="w-full py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Remove</button>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
