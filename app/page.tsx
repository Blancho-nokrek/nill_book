"use client";
import { useState } from "react";

type Result = { number: string; name: string; count: number };

export default function Home() {
  const [mode, setMode] = useState<"number" | "name">("number");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  function switchMode(m: "number" | "name") {
    setMode(m);
    setQuery("");
    setMessage("");
    setResults([]);
  }

  async function search() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setMessage("");
    setResults([]);
    try {
      const res = await fetch(`/api/search?${mode}=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong");
      } else if (mode === "number") {
        if (data.name)
          setResults([
            { number: data.number, name: data.name, count: data.count },
          ]);
        else setMessage("No name found for this number");
      } else {
        if (data.results.length > 0) setResults(data.results);
        else setMessage("No results found for this name");
      }
    } catch {
      setMessage("Connection problem. Please try again.");
    }
    setLoading(false);
  }

  const tab = (m: "number" | "name") =>
    `px-4 py-1 rounded ${
      mode === m ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
    }`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">NILLBOOK</h1>
      <p className="text-gray-500">Connect. Identify. Manage.</p>

      <div className="flex gap-2">
        <button onClick={() => switchMode("number")} className={tab("number")}>
          Number
        </button>
        <button onClick={() => switchMode("name")} className={tab("name")}>
          Name
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder={mode === "number" ? "+8801700000000" : "Search by name"}
          className="border rounded px-3 py-2 w-64 text-black"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && <p className="text-xl">{message}</p>}

      {results.length > 0 && (
        <ul className="flex flex-col gap-3 w-full max-w-md">
          {results.map((r) => (
            <li key={`${r.number}|${r.name}`} className="border rounded p-3">
              <p className="text-xl font-semibold">{r.name}</p>
              <p>{r.number}</p>
              <p className="text-sm text-gray-500">
                saved by {r.count} {r.count === 1 ? "person" : "people"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
