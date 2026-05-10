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
    {
      id: 1,
      text: "Xin chào! Mình là trợ lý GHN.PI-Neon. Bạn cần hỗ trợ gì hôm nay?",
      isUser: false,
      time: "14:32"
    },
    {
      id: 2,
      text: "Tôi muốn tìm hiểu về cách nhận hàng và xác nhận thanh toán Pi Network.",
      isUser: true,
      time: "14:33"
    },
    {
      id: 3,
      text: "Rất vui được hỗ trợ! Bạn có thể vào mục **Nhận Hàng** để tra cứu mã đơn và xác nhận nhận hàng. Hệ thống sẽ tự động ghi nhận qua hợp đồng thông minh Pi Network.",
      isUser: false,
      time: "14:34"
    }
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
      const botReplies = [
        "Cảm ơn bạn! Mình đã nhận được tin nhắn và file.",
        "Bạn có thể kiểm tra trạng thái đơn hàng tại tab **Nhận Hàng**.",
        "Hệ sinh thái GHN.PI xin lỗi bạn vì sự chậm trễ.",
        "Nếu cần hỗ trợ thêm, cứ hỏi mình nhé!",
      ];

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botReplies[Math.floor(Math.random() * botReplies.length)],
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* ==================== HEADER - VÙNG 2 (ĐÃ CẢI TIẾN) ==================== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px' }}>💬</div>
        <div 
          style={headerNeonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px #22d3ee, 0 0 60px #22d3ee, 0 0 90px rgba(34, 211, 238, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px #22d3ee, 0 0 40px rgba(34, 211, 238, 0.5)';
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
            CHAT
          </h1>
          <p style={{ color: '#22d3ee', margin: 0, fontSize: '15px' }}>
            Hỗ trợ khách hàng • GHN.PI Neon
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div style={chatContainerStyle}>
        {/* Messages Area */}
        <div style={messagesContainerStyle}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...messageStyle,
                ...(msg.isUser ? userMessageStyle : botMessageStyle)
              }}
            >
              <div style={msg.isUser ? userMessageBubble : botMessageBubble}>
                {msg.text && <p style={{ margin: '0 0 8px 0' }}>{msg.text}</p>}
                
                {msg.file && (
                  <div style={{ marginTop: '8px' }}>
                    {msg.file.type.startsWith('image/') ? (
                      <img 
                        src={msg.file.url} 
                        alt={msg.file.name} 
                        style={{ maxWidth: '100%', borderRadius: '12px' }} 
                      />
                    ) : (
                      <div style={fileAttachmentStyle}>
                        📎 {msg.file.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={timeStyle}>{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div style={quickRepliesStyle}>
          <button onClick={() => setInputMessage("Cách nhận hàng?")} style={quickButtonStyle}>
            Cách nhận hàng
          </button>
          <button onClick={() => setInputMessage("Thanh toán Pi Network?")} style={quickButtonStyle}>
            Thanh toán Pi
          </button>
          <button onClick={() => setInputMessage("Khiếu nại đơn hàng")} style={quickButtonStyle}>
            Khiếu nại
          </button>
        </div>

        {/* Input Area */}
        <div style={inputAreaStyle}>
          <div 
            style={plusButtonStyle} 
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          >
            +
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />

          {showAttachmentMenu && (
            <div style={attachmentMenuStyle}>
              <div style={menuItemStyle} onClick={() => fileInputRef.current?.click()}>📤 Tải lên một tệp</div>
              <div style={menuItemStyle}>📂 Gần đây</div>
              <div style={menuItemStyle}>🔗 Thêm trình kết nối</div>
            </div>
          )}

          {filePreview && (
            <div style={previewStyle}>
              <img src={filePreview} alt="preview" style={{ maxHeight: '50px', borderRadius: '8px' }} />
              <button onClick={removeSelectedFile} style={removePreviewStyle}>×</button>
            </div>
          )}

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi bất cứ điều gì..."
            style={inputStyle}
          />

          <button onClick={sendMessage} style={sendButtonStyle}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

/* ====================== STYLES ====================== */
const headerNeonStyle = {
  padding: '12px 24px',
  borderRadius: '16px',
  border: '2px solid #22d3ee',
  backgroundColor: 'rgba(30, 41, 55, 0.6)',
  boxShadow: '0 0 20px #22d3ee, 0 0 40px rgba(34, 211, 238, 0.5)',
  transition: 'all 0.4s ease',
  cursor: 'default'
};

const chatContainerStyle = {
  backgroundColor: '#1e2937',
  borderRadius: '24px',
  border: '2px solid #334155',
  height: 'calc(100vh - 180px)',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)'
};

// Các style còn lại giữ nguyên như code cũ của bạn
const messagesContainerStyle = {
  flex: 1,
  padding: '24px',
  overflowY: 'auto' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)'
};

const messageStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  maxWidth: '80%'
};

const userMessageStyle = { alignSelf: 'flex-end' as const };
const botMessageStyle = { alignSelf: 'flex-start' as const };

const botMessageBubble = {
  padding: '14px 18px',
  borderRadius: '18px',
  fontSize: '16px',
  lineHeight: '1.5',
  backgroundColor: '#334155',
  color: '#e2e8f0',
  borderBottomLeftRadius: '4px'
};

const userMessageBubble = {
  padding: '14px 18px',
  borderRadius: '18px',
  fontSize: '16px',
  lineHeight: '1.5',
  backgroundColor: '#22d3ee',
  color: '#0f172a',
  borderBottomRightRadius: '4px'
};

const timeStyle = {
  fontSize: '11px',
  color: '#64748b',
  marginTop: '4px',
  paddingLeft: '4px'
};

const quickRepliesStyle = {
  padding: '12px 20px',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap' as const,
  borderTop: '1px solid #334155',
  backgroundColor: '#1e2937'
};

const quickButtonStyle = {
  backgroundColor: '#0f172a',
  color: '#22d3ee',
  border: '1px solid #22d3ee',
  padding: '8px 16px',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const inputAreaStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#1e2937',
  borderTop: '1px solid #334155',
  gap: '12px',
  position: 'relative' as const
};

const plusButtonStyle = {
  width: '48px',
  height: '48px',
  backgroundColor: '#0f172a',
  color: '#22d3ee',
  border: '2px solid #22d3ee',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  cursor: 'pointer',
  flexShrink: 0
};

const attachmentMenuStyle = {
  position: 'absolute' as const,
  bottom: '75px',
  left: '20px',
  backgroundColor: '#1e2937',
  border: '1px solid #334155',
  borderRadius: '12px',
  padding: '8px 0',
  width: '220px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  zIndex: 100
};

const menuItemStyle = {
  padding: '12px 20px',
  color: '#e2e8f0',
  cursor: 'pointer'
};

const previewStyle = {
  position: 'absolute' as const,
  bottom: '70px',
  left: '70px',
  backgroundColor: '#1e2937',
  padding: '6px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid #22d3ee'
};

const removePreviewStyle = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '14px'
};

const inputStyle = {
  flex: 1,
  padding: '16px 20px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '9999px',
  color: 'white',
  fontSize: '16px',
  outline: 'none'
};

const sendButtonStyle = {
  width: '52px',
  height: '52px',
  backgroundColor: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 0 15px #22d3ee'
};

const fileAttachmentStyle = {
  padding: '10px 14px',
  backgroundColor: '#0f172a',
  borderRadius: '10px',
  border: '1px solid #475569',
  fontSize: '14px'
};