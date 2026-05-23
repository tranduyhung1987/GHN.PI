import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class DriverEngine {
  private deliveredOrders = new Set<string>();

  assignDriver(orderId: string, driverId: string) {
    syncEngine.emit(EVENTS.DRIVER_ASSIGNED, {
      orderId,
      driverId,
      timestamp: Date.now(),
    });
  }

  pickup(orderId: string, driverId: string) {
    syncEngine.emit(EVENTS.PICKED_UP, {
      orderId,
      driverId,
      status: "picked_up",
      timestamp: Date.now(),
    });
  }

  inTransit(orderId: string, driverId: string) {
    syncEngine.emit(EVENTS.IN_TRANSIT, {
      orderId,
      driverId,
      status: "in_transit",
      timestamp: Date.now(),
    });
  }

  deliver(orderId: string, driverId: string) {
    /**
     * Anti double delivery
     */
    if (this.deliveredOrders.has(orderId)) {
      console.warn("⚠️ Duplicate delivery blocked:", orderId);
      return;
    }

    this.deliveredOrders.add(orderId);

    syncEngine.emit(EVENTS.DELIVERED, {
      orderId,
      driverId,
      status: "delivered",
      deliveredAt: Date.now(),
    });
  }
}

export const driverEngine = new DriverEngine();