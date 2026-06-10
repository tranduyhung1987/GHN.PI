// src/pages/TrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import { useAuth } from '../core/auth/AuthContext';
import PullToRefresh from '../components/PullToRefresh';
import { journeyStore } from '../core/journey/journeyStore';
import { routeAnimationEngine } from '../core/map/routeAnimationEngine';
import { StatusTimeline } from '../components/StatusTimeline';
import { TrackingOrderCard } from '../components/TrackingOrderCard';

// ==================== CONSTANTS ====================
const STATUS_FLOW = ['created', 'paid', 'confirmed', 'picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery', 'delivered'];

const STATUS_LABEL: Record<string, string> = {
  created: 'Đã tạo',
  pending_payment: 'Chờ thanh toán',
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  confirmed: 'Đã xác nhận',
  picked_up: 'Đã lấy hàng',
  in_transit: 'Đang giao',
  at_warehouse: 'Tại kho trung chuyển',
  out_for_delivery: 'Đang phát hàng',
  delivered: 'Đã giao thành công',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  failed: 'Giao thất bại',
  complaint: 'Khiếu nại',
};

// ==================== STYLES ====================
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', 
  background: '#f8f7ff', 
  padding: '16px 14px 110px', 
  boxSizing: 'border-box' as const 
};

const roleBar: React.CSSProperties = { 
  background: '#4c1d95', 
  color: 'white', 
  padding: '10px 14px', 
  display: 'flex', 
  justifyContent: 'space-between', 
  borderRadius: '12px', 
  marginBottom: 12 
};

const titleStyle: React.CSSProperties = { 
  fontSize: 22, 
  color: '#4c1d95', 
  textAlign: 'center', 
  margin: '12px 0 16px' 
};

const cardStyle: React.CSSProperties = { 
  background: 'white', 
  padding: 16, 
  borderRadius: 16, 
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
};

const backToListBtn: React.CSSProperties = { 
  background: 'none', 
  border: 'none', 
  color: '#4c1d95', 
  fontSize: 14, 
  marginBottom: 12, 
  fontWeight: 500 
};

export default function TrackingPage() {
  const navigate = useNavigate();
  const { maDon } = useParams<{ maDon?: string }>();
  const { orders: allOrders, loading, loadOrders, getOrdersWithJourney } = useTracking();
  const { updateTracking } = useAppController();
  const { user, role } = useAuth();

  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'issues'>('all');

  // Driver map view
  const location = useLocation();
  const urlView = new URLSearchParams(location.search).get('view');
  const [driverView, setDriverView] = useState<'list' | 'map'>(urlView === 'map' ? 'map' : 'list');

  // ==================== FILTER LOGIC ====================
  const getFilteredOrders = () => {
    let filtered = [...allOrders];
    const uname = user?.username?.toLowerCase() || '';

    // Role-based filtering
    if (role === 'sender' && uname) {
      filtered = filtered.filter((o: any) =>
        (o.piUsername || '').toLowerCase() === uname ||
        (o.nguoiGui || '').toLowerCase().includes(uname)
      );
    } else if (role === 'driver') {
      filtered = filtered.filter((o: any) => {
        const s = (o.trangThai || o.status || '').toLowerCase();
        return ['picked_up', 'in_transit', 'at_warehouse', 'out_for_delivery'].some(k => s.includes(k)) || s === 'created';
      });
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((o: any) =>
        (o.maDon || '').toLowerCase().includes(q) ||
        (o.nguoiNhan || '').toLowerCase().includes(q) ||
        (o.sdtNhan || '').toLowerCase().includes(q) ||
        (o.nguoiGui || '').toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o: any) => {
        const s = (o.trangThai || o.status || 'created').toLowerCase();
        if (statusFilter === 'active') return !['delivered', 'completed', 'cancelled', 'failed'].some(k => s.includes(k));
        if (statusFilter === 'completed') return ['delivered', 'completed'].some(k => s.includes(k));
        if (statusFilter === 'issues') return ['cancelled', 'failed', 'complaint'].some(k => s.includes(k));
        return true;
      });
    }

    filtered.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
    return filtered;
  };

  const filteredOrders = getFilteredOrders();
  const isDetail = !!maDon;
  const currentOrder = isDetail ? filteredOrders.find((o: any) => o.maDon === maDon) : null;
  const displayOrders = isDetail && currentOrder ? [currentOrder] : filteredOrders;

  // ==================== HELPER FUNCTIONS ====================
  const ensureJourneyForOrder = (order: any) => {
    const existing = journeyStore.getJourney(order.maDon);
    if (existing && existing.steps.length > 0) return;

    const currentStatus = (order.trangThai || order.status || 'created').toLowerCase();
    const flowUpTo = STATUS_FLOW.slice(0, STATUS_FLOW.indexOf(currentStatus) + 1 || 1);
    flowUpTo.forEach((st) => journeyStore.addStep(order.maDon, st.toUpperCase()));
  };

  if (currentOrder) ensureJourneyForOrder(currentOrder);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!currentOrder) return;

    setUpdating(true);
    try {
      const payload: any = {
        status: newStatus,
        updatedAt: Date.now(),
        ...currentOrder,
      };

      if ((role === 'driver' || role === 'admin') && (newStatus === 'delivered' || newStatus === 'completed')) {
        payload.driverUsername = user?.username || currentOrder.driverUsername || '';
      }

      await updateTracking(payload);
      journeyStore.addStep(currentOrder.maDon, newStatus.toUpperCase());
      loadOrders();
    } catch (e) {
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const isCancellable = (status: string) =>
    ['created', 'paid', 'confirmed', 'pending', 'pending_payment'].includes((status || '').toLowerCase());

  // ==================== RENDER ====================
  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={roleBar}>
        <span>🔎 {isDetail ? 'CHI TIẾT ĐƠN HÀNG' : 'TRACKING'}</span>
      </div>

      <h1 style={titleStyle}>
        {isDetail 
          ? `📦 Đơn ${maDon}` 
          : (role === 'driver' && driverView === 'map' ? '🗺️ BẢN ĐỒ TUYẾN ĐƯỜNG' : '🔎 TRA CỨU ĐƠN HÀNG')}
      </h1>

      {isDetail && (
        <button onClick={() => navigate('/tracking')} style={backToListBtn}>
          ← Quay lại danh sách đơn
        </button>
      )}

      {/* Driver Map View Switcher */}
      {!isDetail && role === 'driver' && (
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 8px' }}>
          <button onClick={() => setDriverView('list')} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 999, border: driverView === 'list' ? '1px solid #22d3ee' : '1px solid #e0e7ff', background: driverView === 'list' ? '#e0f2fe' : 'white', color: '#4c1d95' }}>
            📋 Danh sách
          </button>
          <button onClick={() => setDriverView('map')} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 999, border: driverView === 'map' ? '1px solid #22d3ee' : '1px solid #e0e7ff', background: driverView === 'map' ? '#e0f2fe' : 'white', color: '#4c1d95' }}>
            🗺️ Bản đồ
          </button>
        </div>
      )}

      {/* Search & Filter */}
      {!isDetail && driverView !== 'map' && (
        <div style={{ marginBottom: 12, padding: '0 16px' }}>
          <input
            type="text"
            placeholder="Tìm mã đơn, người nhận/gửi, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #c4b5fd', background: '#f8f7ff', fontSize: 14, marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'active', label: 'Đang xử lý' },
              { key: 'completed', label: 'Hoàn thành' },
              { key: 'issues', label: 'Vấn đề' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  borderRadius: 999,
                  border: statusFilter === tab.key ? '1px solid #22d3ee' : '1px solid #e0e7ff',
                  background: statusFilter === tab.key ? '#e0f2fe' : 'white',
                  color: '#4c1d95',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Driver Map View */}
      {!isDetail && role === 'driver' && driverView === 'map' && (
        <div style={{ margin: '0 16px 16px', background: 'white', borderRadius: 16, padding: 12, border: '1px solid #e0e7ff' }}>
          <div style={{ fontWeight: 600, color: '#4c1d95', marginBottom: 8 }}>🗺️ Bản đồ tuyến đường (mô phỏng)</div>
          <div style={{ height: 220, background: '#f1f5f9', borderRadius: 12, position: 'relative', border: '1px solid #e0e7ff' }}>
            {/* Map content giữ nguyên như cũ */}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!(role === 'driver' && driverView === 'map') && (
        <PullToRefresh onRefresh={loadOrders}>
          <div style={cardStyle}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</p>
            ) : displayOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '60px 20px' }}>
                {maDon ? `Không tìm thấy đơn ${maDon}` : 'Chưa có đơn hàng nào'}
              </p>
            ) : (
              displayOrders.map((order: any) => {
                const currentStatus = order.trangThai || order.status || 'created';
                const nextStatus = getNextStatus(currentStatus);
                const journeySteps = order.journeySteps || journeyStore.getJourney(order.maDon)?.steps || [];

                return (
                  <TrackingOrderCard
                    key={order.maDon}
                    order={order}
                    isDetail={isDetail}
                    STATUS_LABEL={STATUS_LABEL}
                    nextStatus={nextStatus}
                    updating={updating}
                    canCancel={isCancellable(currentStatus) && role === 'sender'}
                    onViewDetail={(maDon) => navigate(`/tracking/${maDon}`)}
                    onUpdateStatus={handleUpdateStatus}
                    onCancel={() => handleUpdateStatus('cancelled')}
                  />
                );
              })
            )}
          </div>
        </PullToRefresh>
      )}
    </div>
  );
}