import { trackingEngine } from "./TrackingEngine";
import { initRealtime } from "@/core/realtime/initRealtime";

let initialized = false;

export function initEngines() {
  if (initialized) return;

  initialized = true;

  trackingEngine.init();

  initRealtime();

  console.log("🔥 GHN.PI PRO ENGINES READY");
}