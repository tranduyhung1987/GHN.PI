import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import Modal from '../components/Modal';

// Types for community contributions (like real GHN community features)
type ContributionType = 'Góp ý cải tiến' | 'Báo cáo vấn đề' | 'Chia sẻ trải nghiệm' | 'Đề xuất tính năng' | 'Đánh giá dịch vụ' | 'Khác';

interface CommunityPost {
  id: number;
  user: string;
  role: string;
  type: ContributionType;
  title: string;
  content: string;
  rating: number;
  photo?: string; // base64 for mock upload
  likes: number;
  comments: string[];
  timestamp: number;
  likedByMe?: boolean;
}

const CONTRIBUTION_TYPES: ContributionType[] = [
  'Góp ý cải tiến',
  'Báo cáo vấn đề',
  'Chia sẻ trải nghiệm',
  'Đề xuất tính năng',
  'Đánh giá dịch vụ',
  'Khác',
];

const CommunityFeedback: React.FC = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'gui' | 'feed' | 'stats'>('gui');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Tất cả' | ContributionType>('Tất cả');
  const [sortBy, setSortBy] = useState<'newest' | 'mostLiked'>('newest');

  // Form state for submitting contribution
  const [form, setForm] = useState({
    type: 'Góp ý cải tiến' as ContributionType,
    title: '',
    content: '',
    rating: 5,
    photo: undefined as string | undefined,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal for post detail + comments
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newComment, setNewComment] = useState('');

  // Load from localStorage (consistent with other features like addressBook, mySenderInfo)
  useEffect(() => {
    const saved = localStorage.getItem('ghn_community_contributions');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      // Seed some realistic mock data for "như thật" on first load
      const mocks: CommunityPost[] = [
        {
          id: 1,
          user: 'demo_user',
          role: 'sender',
          type: 'Góp ý cải tiến',
          title: 'Nên thêm theo dõi realtime trên map',
          content: 'App rất tốt nhưng theo dõi đơn hàng nên có bản đồ realtime như GHN thật. Hiện tại chỉ status text thôi.',
          rating: 4,
          likes: 12,
          comments: ['Đồng ý 100%!', 'Admin đang làm tính năng này.'],
          timestamp: Date.now() - 86400000 * 2,
        },
        {
          id: 2,
          user: 'receiver_test',
          role: 'receiver',
          type: 'Đánh giá dịch vụ',
          title: 'Tài xế giao nhanh và lịch sự',
          content: 'Đơn hàng của tôi được giao đúng giờ, tài xế gọi trước khi đến. Rất hài lòng với dịch vụ Pi payment.',
          rating: 5,
          likes: 8,
          comments: [],
          timestamp: Date.now() - 86400000,
        },
      ];
      setPosts(mocks);
      localStorage.setItem('ghn_community_contributions', JSON.stringify(mocks));
    }
  }, []);

  // Save to localStorage whenever posts change
  const savePosts = (newPosts: CommunityPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('ghn_community_contributions', JSON.stringify(newPosts));
  };

  // Submit new contribution (full form like real app)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung góp ý!');
      return;
    }

    setSubmitting(true);

    const newPost: CommunityPost = {
      id: Date.now(),
      user: user?.username || 'Ẩn danh',
      role: role || 'guest',
      type: form.type,
      title: form.title.trim(),
      content: form.content.trim(),
      rating: form.rating,
      photo: form.photo,
      likes: 0,
      comments: [],
      timestamp: Date.now(),
      likedByMe: false,
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Success feedback (like CreateShipment success modal pattern)
    setSuccessMsg('Cảm ơn bạn đã đóng góp! Ý kiến của bạn đã được thêm vào bảng tin cộng đồng.');
    setTimeout(() => setSuccessMsg(''), 4000);

    // Reset form
    setForm({
      type: 'Góp ý cải tiến',
      title: '',
      content: '',
      rating: 5,
      photo: undefined,
    });

    // Auto switch to feed tab to see it
    setActiveTab('feed');
    setSubmitting(false);
  };

  // Mock photo upload (store as data URL for demo, like real app attach proof)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({ ...prev, photo: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Like a post (per user simulation with local)
  const handleLike = (postId: number) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const newLikes = (p.likedByMe ? p.likes - 1 : p.likes + 1);
        return { ...p, likes: Math.max(0, newLikes), likedByMe: !p.likedByMe };
      }
      return p;
    });
    savePosts(updated);
  };

  // Add comment (simple, using modal)
  const handleAddComment = () => {
    if (!selectedPost || !newComment.trim()) return;

    const updated = posts.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, comments: [...p.comments, newComment.trim()] };
      }
      return p;
    });
    savePosts(updated);

    // Update selected too
    const newSelected = { ...selectedPost, comments: [...selectedPost.comments, newComment.trim()] };
    setSelectedPost(newSelected);
    setNewComment('');
  };

  // Filtered and sorted feed (full search/filter like optimized OrderPage/Tracking)
  const filteredPosts = React.useMemo(() => {
    let result = [...posts];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.user.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'Tất cả') {
      result = result.filter(p => p.type === filterType);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, searchTerm, filterType, sortBy]);

  // Stats for community (real app dashboard feel)
  const stats = React.useMemo(() => {
    const total = posts.length;
    const avgRating = total > 0 ? (posts.reduce((sum, p) => sum + p.rating, 0) / total).toFixed(1) : '0';
    const byType = CONTRIBUTION_TYPES.map(t => ({
      type: t,
      count: posts.filter(p => p.type === t).length,
    }));
    return { total, avgRating, byType };
  }, [posts]);

  return (
    <div style={pageContainer}>
      <button onClick={() => navigate('/')} style={backButton}>⬅ Quay lại trang chủ</button>

      <div style={contentContainer}>
        <h2 style={titleStyle}>❤️ Đóng góp Cộng đồng GHN.PI</h2>
        <p style={descStyle}>Mọi ý kiến giúp chúng tôi hoàn thiện dịch vụ giao hàng nhanh với Pi. Hãy chia sẻ trải nghiệm dApp GHN.PI cùng chúng tôi!</p>

        {/* Tabs - functional like toggles in CreateShipmentPage / ShippingFeePage */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'gui', label: '📝 Gửi góp ý' },
            { key: 'feed', label: '📰 Bảng tin cộng đồng' },
            { key: 'stats', label: '📊 Thống kê' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9999px',
                background: activeTab === tab.key ? '#22d3ee' : '#ede9fe',
                color: activeTab === tab.key ? '#0f172a' : '#4c1d95',
                border: activeTab === tab.key ? 'none' : '1px solid #c4b5fd',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Success message after submit */}
        {successMsg && (
          <div style={{ ...warningStyle, background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
            ✅ {successMsg}
          </div>
        )}

        {/* TAB 1: GỬI GÓP Ý (full form like real delivery app feedback) */}
        {activeTab === 'gui' && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={sectionStyle}>
              <label style={labelStyle}>Loại đóng góp</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as ContributionType })}
                style={inputStyle}
              >
                {CONTRIBUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Tiêu đề ngắn gọn</label>
              <input
                type="text"
                placeholder="Ví dụ: Nên hỗ trợ COD Pi cho đơn nội thành"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={inputStyle}
                required
              />
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Nội dung chi tiết (như app thật)</label>
              <textarea
                placeholder="Mô tả rõ vấn đề hoặc đề xuất của bạn. Càng chi tiết càng tốt để Admin xử lý nhanh!"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Đánh giá dịch vụ (1-5 sao)</label>
              <div style={{ display: 'flex', gap: '8px', fontSize: '24px' }}>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    onClick={() => setForm({ ...form, rating: star })}
                    style={{ cursor: 'pointer', color: star <= form.rating ? '#f59e0b' : '#d1d5db' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Ảnh minh họa (tùy chọn - như upload proof)</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ marginBottom: '8px' }} />
              {form.photo && <img src={form.photo} alt="preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px' }} />}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...submitButton,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Đang gửi...' : '🚀 GỬI ĐÓNG GÓP CỘNG ĐỒNG'}
            </button>

            <div style={warningStyle}>
              ⚠️ <b>Lưu ý:</b> Admin KHÔNG BAO GIỜ yêu cầu Passphrase ví Pi của bạn. Góp ý của bạn sẽ hiển thị công khai (ẩn danh nếu muốn).
            </div>
          </form>
        )}

        {/* TAB 2: BẢNG TIN CỘNG ĐỒNG (feed like real community tab) */}
        {activeTab === 'feed' && (
          <>
            {/* Search + filters (full like OrderPage search + tabs) */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm góp ý, người dùng..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {['Tất cả', ...CONTRIBUTION_TYPES].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t as any)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '999px',
                      background: filterType === t ? '#22d3ee' : '#ede9fe',
                      color: filterType === t ? '#0f172a' : '#4c1d95',
                      border: '1px solid #c4b5fd',
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setSortBy('newest')} style={{ ...smallBtn, background: sortBy === 'newest' ? '#4c1d95' : '#f3e8ff', color: sortBy === 'newest' ? 'white' : '#4c1d95' }}>Mới nhất</button>
                <button onClick={() => setSortBy('mostLiked')} style={{ ...smallBtn, background: sortBy === 'mostLiked' ? '#4c1d95' : '#f3e8ff', color: sortBy === 'mostLiked' ? 'white' : '#4c1d95' }}>Nhiều thích nhất</button>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <p style={descStyle}>Chưa có đóng góp nào. Hãy là người đầu tiên gửi ý kiến!</p>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} style={postCard} onClick={() => setSelectedPost(post)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={typeBadge}>{post.type}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                        {post.user} ({post.role})
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {new Date(post.timestamp).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <h4 style={{ margin: '4px 0', color: '#4c1d95' }}>{post.title}</h4>
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>{post.content.substring(0, 120)}{post.content.length > 120 ? '...' : ''}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <span>⭐ {post.rating}/5</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      style={{ background: 'none', border: 'none', color: post.likedByMe ? '#ef4444' : '#64748b', cursor: 'pointer' }}
                    >
                      ❤️ {post.likes}
                    </button>
                    <span>💬 {post.comments.length}</span>
                    {post.photo && <span>📷</span>}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* TAB 3: STATS (dashboard like real app) */}
        {activeTab === 'stats' && (
          <div style={sectionStyle}>
            <h3 style={{ color: '#4c1d95' }}>📈 Thống kê cộng đồng</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
              <div style={statCard}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22d3ee' }}>{stats.total}</div>
                <div style={{ fontSize: '13px' }}>Tổng đóng góp</div>
              </div>
              <div style={statCard}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.avgRating}</div>
                <div style={{ fontSize: '13px' }}>Đánh giá trung bình</div>
              </div>
            </div>

            <div>
              <strong>Phân loại:</strong>
              {stats.byType.map(item => (
                <div key={item.type} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.type}</span>
                  <span style={{ fontWeight: 600 }}>{item.count}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
              Số liệu từ cộng đồng người dùng GHN.PI. Cảm ơn mọi đóng góp giúp dịch vụ tốt hơn!
            </p>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT + BÌNH LUẬN (using existing Modal component) */}
      <Modal
        isOpen={!!selectedPost}
        onClose={() => { setSelectedPost(null); setNewComment(''); }}
        title={selectedPost ? selectedPost.title : ''}
        confirmText="Gửi bình luận"
        onConfirm={handleAddComment}
        cancelText="Đóng"
      >
        {selectedPost && (
          <div style={{ textAlign: 'left', fontSize: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={typeBadge}>{selectedPost.type}</span> • {selectedPost.user} ({selectedPost.role}) • ⭐ {selectedPost.rating}
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</p>

            {selectedPost.photo && (
              <img src={selectedPost.photo} alt="minh họa" style={{ maxWidth: '100%', borderRadius: '8px', margin: '8px 0' }} />
            )}

            <div style={{ marginTop: '12px' }}>
              <strong>Bình luận cộng đồng ({selectedPost.comments.length})</strong>
              {selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((c, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', margin: '6px 0', fontSize: '13px' }}>
                    💬 {c}
                  </div>
                ))
              ) : <p style={{ color: '#64748b', fontSize: '13px' }}>Chưa có bình luận. Hãy là người đầu tiên!</p>}
            </div>

            <input
              type="text"
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              style={{ ...inputStyle, marginTop: '8px' }}
              onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

/* --- STYLE GIỮ NGUYÊN TỪ FILE CŨ + MỞ RỘNG FUNCTIONAL (không redesign) --- */
const pageContainer: React.CSSProperties = { padding: '20px', minHeight: '100vh', background: '#fcfcfc' };
const backButton: React.CSSProperties = { background: 'none', border: 'none', color: '#4c1d95', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' };
const contentContainer: React.CSSProperties = { maxWidth: '500px', margin: '0 auto' };
const titleStyle: React.CSSProperties = { color: '#4c1d95', textAlign: 'center' };
const descStyle: React.CSSProperties = { color: '#6b7280', textAlign: 'center', marginBottom: '20px' };
const warningStyle: React.CSSProperties = { marginTop: '20px', padding: '15px', background: '#fef2f2', color: '#991b1b', borderRadius: '12px', fontSize: '12px', textAlign: 'center' };

const sectionStyle: React.CSSProperties = { background: 'white', borderRadius: '12px', padding: '14px', marginBottom: '12px', border: '1px solid #e0d4ff' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontWeight: 600, color: '#4c1d95', fontSize: '14px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #c4b5fd', background: '#ede9fe', color: '#4c1d95', fontSize: '14px', boxSizing: 'border-box' as const };
const submitButton: React.CSSProperties = { width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700, background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', borderRadius: '9999px', marginTop: '8px' };

const typeBadge: React.CSSProperties = { background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 };
const postCard: React.CSSProperties = { background: 'white', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: '1px solid #e0d4ff', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' };
const statCard: React.CSSProperties = { background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid #e0d4ff' };
const smallBtn: React.CSSProperties = { padding: '4px 10px', fontSize: '12px', borderRadius: '999px', border: '1px solid #c4b5fd', cursor: 'pointer' };

export default CommunityFeedback;