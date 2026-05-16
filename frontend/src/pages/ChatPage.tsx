import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ChatPageProps {
  onNavigate: (page: string) => void;
}

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  file?: { name: string; url: string; type: string };
};

const ChatPage: React.FC<ChatPageProps> = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Chào bạn! Bạn cần hỗ trợ gì hôm nay?", isUser: false, time: "10:32" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !isAuthenticated || isSending) return;

    const newMsg: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setIsSending(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Cảm ơn bạn! Đơn hàng của bạn đang được xử lý. Bạn cần hỗ trợ thêm gì không ạ?",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsSending(false);
    }, 1100);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newMsg: Message = {
      id: Date.now(),
      text: '',
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: { name: file.name, url: fileUrl, type: file.type }
    };

    setMessages(prev => [...prev, newMsg]);
    setShowAttachmentMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  if (!isAuthenticated) {
    return <div style={{ padding: '40px 20px', textAlign: 'center' }}>Vui lòng đăng nhập để sử dụng Chat hỗ trợ</div>;
  }

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={header}>
        <div style={{ fontSize: '42px' }}>💬</div>
        <div>
          <h1 style={title}>HỖ TRỢ CHAT</h1>
          <p style={subtitle}>CSKH GHN.PI • Trả lời nhanh 24/7</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={chatContainer}>
        {messages.map(msg => (
          <div key={msg.id} style={msg.isUser ? myMessage : adminMessage}>
            <div style={msg.isUser ? myMessageBubble : adminMessageBubble}>
              {msg.text && <p>{msg.text}</p>}
              {msg.file && (
                <div style={{ marginTop: '8px' }}>
                  {msg.file.type.startsWith('image/') ? (
                    <img src={msg.file.url} alt={msg.file.name} style={previewImage} />
                  ) : (
                    <div style={filePreview}>📎 {msg.file.name}</div>
                  )}
                </div>
              )}
            </div>
            <span style={timeStyle}>{msg.time}</span>
          </div>
        ))}
        {isSending && <div style={typingIndicator}>CSKH đang trả lời...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA - GIỮ NGUYÊN GIAO DIỆN BẠN MUỐN */}
      <div style={inputArea}>
        <div style={inputWrapper}>
          <div onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} style={plusButtonInside}>+</div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            style={inputStyle}
          />

          <button onClick={sendMessage} style={sendButton} disabled={isSending || !newMessage.trim()}>
            {isSending ? '⏳' : 'Gửi'}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div style={attachmentMenu}>
          <div onClick={() => fileInputRef.current?.click()} style={menuItem}>📷 Ảnh</div>
          <div onClick={() => fileInputRef.current?.click()} style={menuItem}>🎥 Video</div>
          <div onClick={() => fileInputRef.current?.click()} style={menuItem}>📄 Tài liệu</div>
        </div>
      )}
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box',
};

const header: React.CSSProperties = { 
  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', justifyContent: 'center' as const 
};

const title: React.CSSProperties = { fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle: React.CSSProperties = { color: '#6b21a8', fontSize: '14px', textAlign: 'center' as const };

const chatContainer: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  paddingBottom: '20px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
};

const myMessage: React.CSSProperties = { alignSelf: 'flex-end' as const, maxWidth: '78%' };
const adminMessage: React.CSSProperties = { alignSelf: 'flex-start' as const, maxWidth: '78%' };

const myMessageBubble: React.CSSProperties = { padding: '12px 16px', borderRadius: '18px', background: '#22d3ee', color: '#0f172a' };
const adminMessageBubble: React.CSSProperties = { padding: '12px 16px', borderRadius: '18px', background: '#fff', border: '1px solid #c4b5fd', color: '#4c1d95' };

const timeStyle: React.CSSProperties = { fontSize: '11px', color: '#64748b', marginTop: '4px' };
const typingIndicator: React.CSSProperties = { color: '#64748b', fontStyle: 'italic', padding: '8px 0' };

const inputArea: React.CSSProperties = {
  position: 'fixed',
  bottom: '76px',
  left: '14px',
  right: '14px',
  zIndex: 10
};

const inputWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#f3e8ff',
  borderRadius: '9999px',
  padding: '6px',
  border: '1px solid #c4b5fd'
};

const plusButtonInside: React.CSSProperties = {
  width: '42px',
  height: '42px',
  background: 'transparent',
  color: '#64748b',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '26px',
  cursor: 'pointer',
  marginRight: '6px'
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px 8px',
  border: 'none',
  background: 'transparent',
  fontSize: '16px',
  outline: 'none'
};

const sendButton: React.CSSProperties = {
  padding: '12px 24px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700',
  marginLeft: '6px'
};

const attachmentMenu: React.CSSProperties = {
  position: 'fixed',
  bottom: '150px',
  left: '20px',
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  padding: '10px 0',
  zIndex: 1001,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px'
};

const menuItem: React.CSSProperties = { padding: '12px 24px', fontSize: '16px', cursor: 'pointer' };

/* === FIX LỖI ĐỎ === */
const previewImage: React.CSSProperties = {
  maxWidth: '220px',
  borderRadius: '12px',
  marginTop: '8px'
};

const filePreview: React.CSSProperties = {
  padding: '10px',
  background: '#f1f5f9',
  borderRadius: '10px',
  fontSize: '14px'
};

export default ChatPage;