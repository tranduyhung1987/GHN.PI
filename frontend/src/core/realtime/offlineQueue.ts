type QueueItem = {
  id: string;
  event: string;
  payload: any;
  retry: number;
};

class OfflineQueue {
  private queue: QueueItem[] = [];

  add(event: string, payload: any) {
    this.queue.push({
      id: crypto.randomUUID(),
      event,
      payload,
      retry: 0,
    });
  }

  getAll() {
    return this.queue;
  }

  remove(id: string) {
    this.queue = this.queue.filter((q) => q.id !== id);
  }

  clear() {
    this.queue = [];
  }
}

export const offlineQueue = new OfflineQueue();