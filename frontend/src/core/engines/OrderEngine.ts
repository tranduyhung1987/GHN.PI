import { syncEngine } from "@/core/realtime/syncEngine";
import { EVENTS } from "@/core/events/eventTypes";
import { saveOrder, updateOrderStatus } from "@/services/firebase/orderService";

const STORAGE_KEY = 'ghn_pi_orders';

function persistOrderLocal(order: any) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [order, ...existing.filter((o: any) => o.maDon !== order.maDon)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.warn('[OrderEngine] Failed to persist to localStorage');
  }
}

async function persistOrderFirebase(order: any) {
  try {
    await saveOrder(order);
  } catch (e) {
    console.warn('[OrderEngine] Firebase sync failed (will rely on localStorage)');
  }
}

class OrderEngineCore {
  // ===== CORE ACTIONS =====

  createOrder(order: any) {
    const enriched = {
      ...order,
      createdAt: order.createdAt || Date.now(),
      status: order.status || "created",
    };

    syncEngine.emit(EVENTS.ORDER_CREATED, enriched);

    // Lưu local (offline-first)
    persistOrderLocal(enriched);

    // Sync lên Firebase (không chặn UI)
    persistOrderFirebase(enriched);
  }

  confirmOrder(orderId: string) {
    syncEngine.emit(EVENTS.ORDER_CONFIRMED, {
      orderId,
      confirmedAt: Date.now(),
      status: "confirmed",
    });
  }

  // ===== ADAPTER METHODS (dùng bởi AppController) =====

  async create(payload: any) {
    return this.createOrder(payload);
  }

  async update(payload: any) {
    syncEngine.emit(EVENTS.ORDER_UPDATED, {
      ...payload,
      updatedAt: Date.now(),
    });

    persistOrderLocal(payload);

    // Cập nhật Firebase
    if (payload.maDon && payload.status) {
      updateOrderStatus(payload.maDon, payload.status).catch(() => {});
    } else {
      persistOrderFirebase(payload);
    }
  }

  async sync() {
    return true;
  }

  async init() {
    console.log('[OrderEngine] Initialized');
    return true;
  }
}

export const OrderEngine = new OrderEngineCore();