import { getAnalytics, isSupported, logEvent, type EventParams } from "firebase/analytics";
import { app } from "@/lib/firebase/client";

export async function trackEvent(name: string, params: EventParams = {}): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    if (!(await isSupported())) return;
    logEvent(getAnalytics(app), name, params);
  } catch {
    // Analytics must never interrupt a customer request or admin save.
  }
}
