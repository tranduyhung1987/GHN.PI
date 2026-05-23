import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class WarehouseEngine {
  updateInventory(data: any) {
    syncEngine.emit(EVENTS.WAREHOUSE_UPDATED, {
      ...data,
      updatedAt: Date.now(),
    });
  }
}

export const warehouseEngine = new WarehouseEngine();