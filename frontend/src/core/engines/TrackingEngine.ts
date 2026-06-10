import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";
import { eventBus } from "@/core/events/eventBus";

class TrackingEngineCore {
  updateTracking(data: any) {
    syncEngine.emit(EVENTS.TRACKING_UPDATED, {
      ...data,
      updatedAt: Date.now(),
    });
  }

  updateLocation(orderId: string, location: any) {
    syncEngine.emit(EVENTS.TRACKING_LOCATION_UPDATED, {
      orderId,
      location,
      timestamp: Date.now(),
    });
  }

  updateDriverLocation(payload: any) {
    eventBus.emit("DRIVER_LOCATION_UPDATED", {
      driverId: payload.driverId,
      lat: payload.lat,
      lng: payload.lng,
      updatedAt: Date.now(),
    });
  }

  async update(payload: any) {
    return this.updateTracking(payload);
  }

  async sync() {
    return true;
  }

  async init() {
    return true;
  }

  async process(payload: any) {
    return this.updateTracking(payload);
  }
}

// ✅ FIX: Dùng singleton + lazy initialization để tránh circular dependency
let instance: TrackingEngineCore | null = null;

export const TrackingEngine = {
  getInstance(): TrackingEngineCore {
    if (!instance) {
      instance = new TrackingEngineCore();
    }
    return instance;
  },

  // Giữ nguyên API cũ để không phải sửa nhiều chỗ khác
  init() {
    return this.getInstance().init();
  },

  updateTracking(data: any) {
    return this.getInstance().updateTracking(data);
  },

  updateLocation(orderId: string, location: any) {
    return this.getInstance().updateLocation(orderId, location);
  },

  updateDriverLocation(payload: any) {
    return this.getInstance().updateDriverLocation(payload);
  },

  update(payload: any) {
    return this.getInstance().update(payload);
  },

  sync() {
    return this.getInstance().sync();
  },

  process(payload: any) {
    return this.getInstance().process(payload);
  },
};