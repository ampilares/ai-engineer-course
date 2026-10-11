"use client";

import { useRef, useState } from "react";
import { useInteraction } from "../lesson/LessonInteractions";
import { WidgetFrame } from "./WidgetFrame";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
let pyodidePromise: Promise<any> | null = null;

function loadPyodideOnce(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${PYODIDE_URL}pyodide.js`;
    script.onload = () => {
      window
        .loadPyodide!({ indexURL: PYODIDE_URL })
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () => reject(new Error("Could not load the Python runtime (network required)."));
    document.head.appendChild(script);
  });
  return pyodidePromise;
}

/**
 * In-browser Python exercise (Pyodide, loaded on demand from CDN).
 * `test` is Python that raises AssertionError when the learner's code is wrong;
 * it runs in the same namespace as the learner's code.
 */
export function PythonPractice({
  title,
  instructions,
  starter,
  test,
  solution,
}: {
  title: string;
  instructions: string;
  starter: string;
  test: string;
  solution: string;
}) {
  const { complete } = useInteraction();
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "running" | "passed" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const pyodideRef = useRef<any>(null);

  async function ensureRuntime() {
    setStatus("loading");
    setError(null);
    try {
      pyodideRef.current = await loadPyodideOnce();
      setStatus("ready");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Failed to load Python.");
    }
  }

  async function run() {
    const pyodide = pyodideRef.current;
    if (!pyodide) return;
    setStatus("running");
    setError(null);
    const lines: string[] = [];
    pyodide.setStdout({ batched: (s: string) => lines.push(s) });
    pyodide.setStderr({ batched: (s: string) => lines.push(s) });
    const ns = pyodide.toPy({});
    try {
      await pyodide.runPythonAsync(code, { globals: ns });
      try {
        await pyodide.runPythonAsync(test, { globals: ns });
        setOutput(lines.join("\n"));
        setStatus("passed");
        complete();
      } catch (e) {
        setOutput(lines.join("\n"));
        setStatus("failed");
        setAttempts((a) => a + 1);
        setError(shortPyError(e, "A check failed: your code runs, but the result isn't right yet."));
      }
    } catch (e) {
      setOutput(lines.join("\n"));
      setStatus("failed");
      setAttempts((a) => a + 1);
      setError(shortPyError(e, "Your code raised an error."));
    } finally {
      ns.destroy?.();
    }
  }

  return (
    <WidgetFrame
      title={`Practice: ${title}`}
      onReset={() => { setCode(starter); setOutput(""); setError(null); setShowSolution(false); if (status !== "idle" && status !== "loading") setStatus("ready"); }}
      srSummary={`Python coding exercise: ${instructions}`}
    >
      <p className="text-[15px] mb-3">{instructions}</p>
      {status === "idle" || status === "loading" ? (
        <button type="button" onClick={ensureRuntime} disabled={status === "loading"} className="btn-primary text-sm">
          {status === "loading" ? "Loading Python… (first time takes a moment)" : "▶ Start: load Python in your browser (~10 MB)"}
        </button>
      ) : (
        <>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.max(6, starter.split("\n").length + 2)}
            spellCheck={false}
            className="input font-mono text-sm leading-6"
            aria-label="Python code editor"
          />
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <button type="button" onClick={run} disabled={status === "running"} className="btn-primary text-sm">
              {status === "running" ? "Running…" : "Run code"}
            </button>
            {status === "passed" && <span className="text-ok font-medium text-sm">✓ All checks passed</span>}
            {attempts >= 2 && status !== "passed" && (
              <button type="button" onClick={() => setShowSolution((s) => !s)} className="btn-ghost text-sm">
                {showSolution ? "Hide solution" : "Show a solution"}
              </button>
            )}
          </div>
          {output && (
            <pre className="mt-3 rounded-lg border line p-3 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">{output}</pre>
          )}
          {error && (
            <p role="alert" className="mt-2 text-sm text-bad whitespace-pre-wrap">{error}</p>
          )}
          {showSolution && (
            <pre className="mt-3 rounded-lg border border-accent/40 bg-accent/5 p-3 text-sm font-mono whitespace-pre-wrap">{solution}</pre>
          )}
        </>
      )}
      <p className="text-xs muted mt-3">
        Runs entirely in your browser via Pyodide: nothing you type leaves your machine.
      </p>
    </WidgetFrame>
  );
}

function shortPyError(e: unknown, prefix: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  // Keep the last few traceback lines: the informative part.
  const tail = msg.trim().split("\n").slice(-3).join("\n");
  return `${prefix}\n${tail}`;
}
