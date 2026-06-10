// src/components/StatusTimeline.tsx
import React from 'react';

interface StatusTimelineProps {
  currentStatus: string;
  journeySteps?: Array<{ status: string; timestamp: number }>;
}

const STATUS_LABEL: Record<string, string> = {
  created: 'Đã tạo',
  pending_payment: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  confirmed: 'Đã xác nhận',
  picked_up: 'Đã lấy hàng',
  in_transit: 'Đang giao',
  at_warehouse: 'Tại kho trung chuyển',
  out_for_delivery: 'Đang phát hàng',
  delivered: 'Đã giao thành công',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
};

const STATUS_FLOW = [
  'created', 'paid', 'confirmed', 'picked_up', 
  'in_transit', 'at_warehouse', 'out_for_delivery', 'delivered'
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ 
  currentStatus, 
  journeySteps = [] 
}) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus.toLowerCase());

  const stepsToShow = journeySteps.length > 0 
    ? journeySteps.map(s => s.status.toLowerCase())
    : STATUS_FLOW.slice(0, currentIndex + 1);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>
        Trạng thái đơn hàng
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stepsToShow.map((status, index) => {
          const isActive = currentIndex >= STATUS_FLOW.indexOf(status);
          const label = STATUS_LABEL[status] || status;

          return (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                opacity: isActive ? 1 : 0.5 
              }}
            >
              <div style={{ width: 20, textAlign: 'center' }}>
                {isActive ? '✅' : '○'}
              </div>
              <div style={{ fontSize: 14 }}>
                {label}
                {journeySteps[index] && (
                  <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>
                    ({new Date(journeySteps[index].timestamp).toLocaleTimeString('vi-VN')})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};