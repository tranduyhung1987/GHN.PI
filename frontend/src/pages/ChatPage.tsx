// src/pages/ChatPage.tsx
import { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  file?: { name: string; url: string; type: string };
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Xin chào! Mình là trợ lý GHN.PI-Neon. Bạn cần hỗ trợ gì hôm nay?", isUser: false, time: "14:32" },
    { id: 2, text: "Tôi muốn tìm hiểu về cách nhận hàng và thanh toán Pi.", isUser: true, time: "14:33" },
    { id: 3, text: "Rất vui được hỗ trợ! Bạn có thể vào **Nhận Hàng** để tra cứu và xác nhận qua hợp đồng Pi Network.", isUser: false, time: "14:34" },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowAttachmentMenu(false);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: selectedFile ? {
        name: selectedFile.name,
        url: filePreview || URL.createObjectURL(selectedFile),
        type: selectedFile.type
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    removeSelectedFile();

    setTimeout(() => {
      const replies = [
        "Cảm ơn bạn! Mình đã ghi nhận.",
        "Bạn có thể kiểm tra trạng thái tại trang **Nhận Hàng**.",
        "Hệ thống GHN.PI đang hỗ trợ bạn 24/7.",
        "Cần hỗ trợ thêm gì nữa không ạ?"
      ];
      const botMessage: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: '48px' }}>💬</div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>CHAT HỖ TRỢ</h1>
          <p style={{ color: '#6b21a8', margin: 0, fontSize: '15px' }}>GHN.PI Neon • Trợ lý On-chain 24/7</p>
        </div>
      </div>

      {/* Chat Container */}
      <div style={chatContainer}>
        {/* Messages Area */}
        <div style={messagesArea}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: '18px',
                background: msg.isUser ? '#22d3ee' : '#ede9fe',
                color: msg.isUser ? '#0f172a' : '#4c1d95',
                borderBottomRightRadius: msg.isUser ? '4px' : '18px',
                borderBottomLeftRadius: msg.isUser ? '18px' : '4px',
              }}>
                {msg.text && <p style={{ margin: 0 }}>{msg.text}</p>}
                {msg.file && (
                  <div style={{ marginTop: '8px' }}>
                    {msg.file.type.startsWith('image/') ? (
                      <img src={msg.file.url} alt={msg.file.name} style={{ maxWidth: '100%', borderRadius: '12px' }} />
                    ) : (
                      <div style={{ padding: '10px', background: '#f3e8ff', borderRadius: '10px' }}>
                        📎 {msg.file.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', paddingLeft: '6px' }}>
                {msg.time}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div style={quickRepliesContainer}>
          {["Cách nhận hàng?", "Thanh toán Pi?", "Khiếu nại đơn", "Tra cứu cước phí"].map((q, i) => (
            <button key={i} onClick={() => setInputMessage(q)} style={quickReplyBtn}>
              {q}
            </button>
          ))}
        </div>

        {/* Input Area - ĐÃ CHỈNH CÂN ĐỐI */}
        <div style={inputArea}>
          <div 
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} 
            style={attachmentBtn}
          >
            +
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,.pdf"
          />

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            style={messageInput}
          />

          <button onClick={sendMessage} style={sendBtn}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  width: '100%',
  background: '#f3e8ff',
  padding: '16px 0 80px',
  boxSizing: 'border-box' as const
} as const;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '0 14px',
  marginBottom: '16px'
} as const;

const chatContainer = {
  background: '#ede9fe',
  borderRadius: '24px',
  margin: '0 14px',
  height: 'calc(100vh - 140px)',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  border: '1px solid #c4b5fd'
} as const;

const messagesArea = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px'
} as const;

const quickRepliesContainer = {
  padding: '12px 16px',
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap' as const,
  borderTop: '1px solid #c4b5fd',
  background: '#f3e8ff'
} as const;

const quickReplyBtn = {
  background: '#fff',
  color: '#4c1d95',
  border: '1px solid #c4b5fd',
  padding: '8px 16px',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const
} as const;

const inputArea = {
  padding: '12px 14px',
  background: '#ede9fe',
  borderTop: '1px solid #c4b5fd',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
} as const;

const attachmentBtn = {
  width: '30px',           // ← Giảm kích thước nút +
  height: '30px',
  background: '#fff',
  border: '2px solid #22d3ee',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',        // ← Giảm font size
  color: '#22d3ee',
  cursor: 'pointer',
  flexShrink: 0
} as const;

const messageInput = {
  flex: 1,
  padding: '14px 12px',
  background: '#fff',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  fontSize: '16px',
  color: '#4c1d95',
  outline: 'none'
} as const;

const sendBtn = {
  width: '48px',
  height: '48px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '50%',
  fontSize: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0
} as const;