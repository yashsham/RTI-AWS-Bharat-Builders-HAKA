import { useState, useCallback } from "react";
import { StepEvent, RTIResult, DraftOptions } from "../lib/types";
import { streamRtiDraft } from "../lib/api";

export type StreamStatus = "idle" | "running" | "success" | "error";

export function useRtiStream() {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [steps, setSteps] = useState<StepEvent[]>([]);
  const [tokens, setTokens] = useState<string>("");
  const [result, setResult] = useState<RTIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setSteps([]);
    setTokens("");
    setResult(null);
    setError(null);
  }, []);

  const start = useCallback(async (query: string, options?: DraftOptions) => {
    reset();
    setStatus("running");

    try {
      for await (const event of streamRtiDraft(query, options)) {
        if (event.type === "step") {
          setSteps((prev) => {
            const existingIdx = prev.findIndex((s) => s.id === event.id);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = event;
              return updated;
            }
            return [...prev, event];
          });
        } else if (event.type === "token") {
          setTokens((prev) => prev + event.text);
        } else if (event.type === "result") {
          setResult(event.data);
          setStatus("success");
        } else if (event.type === "error") {
          setError(event.message);
          setStatus("error");
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected streaming error occurred.");
      setStatus("error");
    }
  }, [reset]);

  return {
    status,
    steps,
    tokens,
    result,
    error,
    start,
    reset,
  };
}
