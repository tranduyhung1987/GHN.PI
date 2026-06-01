// src/pages/IncompletePaymentsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIncompletePayments, IncompletePayment } from '../services/firebase/incompletePaymentService';

export default function IncompletePaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<IncompletePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncompletePayments();
      // Sắp xếp mới nhất trước
      const sorted = [...data].sort((a, b) => (b.detectedAt || 0) - (a.detectedAt || 0));
      setPayments(sorted);
    } catch (e: any) {
      setError('Không thể tải danh sách incomplete payments');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleMarkResolved = (identifier: string) => {
    // TODO: Thêm logic xóa hoặc đánh dấu đã xử lý thật sự (Firestore)
    const confirmed = confirm(`Đánh dấu giao dịch ${identifier} đã được xử lý?`);
    if (!confirmed) return;

    // Tạm thời xóa khỏi local state (sau này kết nối backend thật)
    setPayments(prev => prev.filter(p => p.identifier !== identifier));

    // TODO: Gọi API xóa trên Firestore + backend Pi
    alert('Đã đánh dấu là đã xử lý (chỉ UI). Cần kết nối backend để xóa thật.');
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Không rõ';
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  };

  return (
    <div style={pageContainer}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Quay lại</button>

      <h1 style={title}>⚠️ Incomplete Pi Payments</h1>
      <p style={subtitle}>
        Các giao dịch thanh toán Pi chưa hoàn tất (theo yêu cầu Pi Network). 
        Cần xử lý thủ công hoặc qua backend.
      </p>

      <div style={card}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
        ) : error ? (
          <div style={{ color: '#dc2626', padding: '20px' }}>{error}</div>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#16a34a' }}>
            ✅ Không có giao dịch Pi nào chưa hoàn tất.<br />
            Hệ thống đang hoạt động tốt.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, fontWeight: 600, color: '#991b1b' }}>
              Tìm thấy {payments.length} giao dịch chưa hoàn tất
            </div>

            {payments.map((payment, index) => (
              <div key={payment.identifier || index} style={paymentCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#4c1d95' }}>
                      {payment.identifier}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 15 }}>
                      <strong>Số Pi:</strong> {payment.amount} Pi
                    </div>
                    {payment.memo && (
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        Memo: {payment.memo}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                      Phát hiện lúc: {formatDate(payment.detectedAt)}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleMarkResolved(payment.identifier)}
                    style={resolveBtn}
                  >
                    Đánh dấu đã xử lý
                  </button>
                </div>

                {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                  <div style={metadataBox}>
                    <strong>Metadata:</strong>
                    <pre style={{ fontSize: 11, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(payment.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
        Lưu ý: Xử lý incomplete payment cần backend + Pi Server Approval.
      </div>
    </div>
  );
}

/* Styles */
const pageContainer: React.CSSProperties = { padding: '18px 16px 100px', background: '#fffbeb', minHeight: '100vh' };
const backBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#92400e', fontSize: 15, fontWeight: 600, marginBottom: 12 };
const title: React.CSSProperties = { color: '#92400e', fontSize: 24, fontWeight: 700, margin: '0 0 8px' };
const subtitle: React.CSSProperties = { color: '#854d0e', fontSize: 14, marginBottom: 20 };

const card: React.CSSProperties = { background: 'white', borderRadius: 20, padding: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' };
const paymentCard: React.CSSProperties = { background: '#fffbeb', padding: 16, borderRadius: 16, marginBottom: 12, border: '1px solid #fde047' };
const resolveBtn: React.CSSProperties = { background: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' };
const metadataBox: React.CSSProperties = { marginTop: 12, background: '#fefce8', padding: 10, borderRadius: 10, fontSize: 12 };
