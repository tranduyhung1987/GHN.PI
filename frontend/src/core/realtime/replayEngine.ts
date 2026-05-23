import { eventBus } from "@/core/events/eventBus";

class ReplayEngine {
  private history: any[] = [];

  record(event: string, payload: any) {
    this.history.push({ event, payload });
  }

  replay() {
    this.history.forEach((h) => {
      eventBus.emit(h.event, h.payload);
    });
  }

  clear() {
    this.history = [];
  }
}

export const replayEngine = new ReplayEngine();