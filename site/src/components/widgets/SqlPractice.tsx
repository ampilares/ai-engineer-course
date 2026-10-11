"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLessonInteractions } from "../lesson/LessonInteractions";
import { WidgetFrame } from "./WidgetFrame";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    initSqlJs?: (opts: { locateFile: (f: string) => string }) => Promise<any>;
  }
}

const SQLJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/";
let sqlJsPromise: Promise<any> | null = null;

function loadSqlJsOnce(): Promise<any> {
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${SQLJS_CDN}sql-wasm.js`;
    script.onload = () => {
      window
        .initSqlJs!({ locateFile: (f) => `${SQLJS_CDN}${f}` })
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () => reject(new Error("Could not load the SQL engine (network required)."));
    document.head.appendChild(script);
  });
  return sqlJsPromise;
}

/**
 * In-browser SQL exercise (sql.js / SQLite compiled to WebAssembly).
 * The learner's query result is compared against the reference query's result
 * (column names + rows; row order ignored unless `ordered`).
 */
export function SqlPractice({
  title,
  instructions,
  schema,
  solutionQuery,
  starter = "SELECT ",
  ordered = false,
}: {
  title: string;
  instructions: string;
  schema: string;
  solutionQuery: string;
  starter?: string;
  ordered?: boolean;
}) {
  const id = useId();
  const ctx = useLessonInteractions();
  const [query, setQuery] = useState(starter);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "passed" | "failed">("idle");
  const [result, setResult] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const sqlRef = useRef<any>(null);

  useEffect(() => {
    ctx?.register(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function ensureRuntime() {
    setStatus("loading");
    setError(null);
    try {
      sqlRef.current = await loadSqlJsOnce();
      setStatus("ready");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Failed to load SQL engine.");
    }
  }

  function normalize(res: { columns: string[]; values: any[][] } | undefined) {
    if (!res) return null;
    const rows = res.values.map((r) => r.map((v) => (v === null ? null : String(v))));
    if (!ordered) rows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    return { cols: res.columns.map((c) => c.toLowerCase()), rows };
  }

  function run() {
    const SQL = sqlRef.current;
    if (!SQL) return;
    setError(null);
    let db: any = null;
    try {
      db = new SQL.Database();
      db.run(schema);
      const userRes = db.exec(query)[0] as { columns: string[]; values: any[][] } | undefined;
      const refRes = db.exec(solutionQuery)[0] as { columns: string[]; values: any[][] } | undefined;
      setResult(userRes ?? { columns: [], values: [] });
      const got = normalize(userRes);
      const want = normalize(refRes);
      if (got && want && JSON.stringify(got.rows) === JSON.stringify(want.rows)) {
        setStatus("passed");
        ctx?.setCorrect(id, true);
      } else {
        setStatus("failed");
        setAttempts((a) => a + 1);
      }
    } catch (e) {
      setResult(null);
      setStatus("failed");
      setAttempts((a) => a + 1);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      db?.close?.();
    }
  }

  return (
    <WidgetFrame
      title={`Practice: ${title}`}
      onReset={() => { setQuery(starter); setResult(null); setError(null); setShowSolution(false); if (status !== "idle" && status !== "loading") setStatus("ready"); }}
      srSummary={`SQL exercise against an in-browser SQLite database: ${instructions}`}
    >
      <p className="text-[15px] mb-2">{instructions}</p>
      <details className="mb-3 text-sm">
        <summary className="cursor-pointer muted">View the table schema & data</summary>
        <pre className="mt-2 rounded-lg border line p-3 font-mono text-xs whitespace-pre-wrap">{schema.trim()}</pre>
      </details>
      {status === "idle" || status === "loading" ? (
        <button type="button" onClick={ensureRuntime} disabled={status === "loading"} className="btn-primary text-sm">
          {status === "loading" ? "Loading SQLite…" : "▶ Start: load SQLite in your browser (~1 MB)"}
        </button>
      ) : (
        <>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            spellCheck={false}
            className="input font-mono text-sm leading-6"
            aria-label="SQL query editor"
          />
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <button type="button" onClick={run} className="btn-primary text-sm">Run query</button>
            {status === "passed" && <span className="text-ok font-medium text-sm">✓ Correct result</span>}
            {status === "failed" && !error && <span className="text-bad text-sm">Not the expected result: compare and adjust.</span>}
            {attempts >= 2 && status !== "passed" && (
              <button type="button" onClick={() => setShowSolution((s) => !s)} className="btn-ghost text-sm">
                {showSolution ? "Hide solution" : "Show a solution"}
              </button>
            )}
          </div>
          {error && <p role="alert" className="mt-2 text-sm text-bad font-mono">{error}</p>}
          {result && result.columns.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="text-sm font-mono w-full">
                <thead>
                  <tr>{result.columns.map((c) => <th key={c} className="text-left border-b line px-2 py-1">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {result.values.slice(0, 20).map((row, i) => (
                    <tr key={i}>{row.map((v, j) => <td key={j} className="px-2 py-1 border-b line">{v === null ? "NULL" : String(v)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {result.values.length > 20 && <p className="text-xs muted mt-1">…{result.values.length - 20} more rows</p>}
            </div>
          )}
          {showSolution && (
            <pre className="mt-3 rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm font-mono whitespace-pre-wrap">{solutionQuery}</pre>
          )}
        </>
      )}
      <p className="text-xs muted mt-3">A real SQLite database running in your browser: experiment freely.</p>
    </WidgetFrame>
  );
}
