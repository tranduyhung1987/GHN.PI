import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";

class OrderEngine {
  createOrder(order: any) {
    syncEngine.emit(EVENTS.ORDER_CREATED, {
      ...order,
      createdAt: Date.now(),
      status: "created",
    });
  }

  confirmOrder(orderId: string) {
    syncEngine.emit(EVENTS.ORDER_CONFIRMED, {
      orderId,
      confirmedAt: Date.now(),
      status: "confirmed",
    });
  }
}

export const orderEngine = new OrderEngine();