import { eventBus } from "@/core/events/eventBus";
import { offlineQueue } from "./offlineQueue";
import { networkMonitor } from "./network";

class SyncEngine {
  constructor() {
    networkMonitor.subscribe((status) => {
      if (status === "online") {
        this.flushQueue();
      }
    });
  }

  emit(event: string, payload: any) {
    if (networkMonitor.getStatus() === "offline") {
      offlineQueue.add(event, payload);
      console.log("📴 queued:", event);
      return;
    }

    eventBus.emit(event, payload);
  }

  flushQueue() {
    const queue = offlineQueue.getAll();

    queue.forEach((item) => {
      console.log("🔄 retry:", item.event);

      eventBus.emit(item.event, item.payload);

      offlineQueue.remove(item.id);
    });
  }
}

export const syncEngine = new SyncEngine();