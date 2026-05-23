import { eventBus } from "@/core/events/eventBus";
import { EVENTS } from "@/core/events/eventTypes";

class TrackingEngine {
  private trackingState = new Map<string, any>();

  init() {
    eventBus.on(EVENTS.ORDER_CREATED, this.onOrderCreated);
    eventBus.on(EVENTS.DRIVER_ASSIGNED, this.onDriverAssigned);
    eventBus.on(EVENTS.PICKED_UP, this.onPickedUp);
    eventBus.on(EVENTS.IN_TRANSIT, this.onTransit);
    eventBus.on(EVENTS.DELIVERED, this.onDelivered);
  }

  onOrderCreated = (data: any) => {
    this.trackingState.set(data.orderId, data);

    console.log("📦 ORDER_CREATED", data);
  };

  onDriverAssigned = (data: any) => {
    this.update(data.orderId, {
      driverId: data.driverId,
      status: "driver_assigned",
    });
  };

  onPickedUp = (data: any) => {
    this.update(data.orderId, {
      status: "picked_up",
    });
  };

  onTransit = (data: any) => {
    this.update(data.orderId, {
      status: "in_transit",
    });
  };

  onDelivered = (data: any) => {
    this.update(data.orderId, {
      status: "delivered",
      deliveredAt: data.deliveredAt,
    });
  };

  update(orderId: string, partial: any) {
    const current = this.trackingState.get(orderId) || {};

    this.trackingState.set(orderId, {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    });

    console.log("🚚 TRACKING UPDATE:", orderId);
  }

  getTracking(orderId: string) {
    return this.trackingState.get(orderId);
  }
}

export const trackingEngine = new TrackingEngine();