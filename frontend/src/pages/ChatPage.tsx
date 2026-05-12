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

    // Bot reply
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
    <div style={{ padding: '20px 0', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* HEADER NEON */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px' }}>💬</div>
        <div style={{
          padding: '12px 24px',
          background: 'rgba(30, 41, 55, 0.9)',
          borderRadius: '16px',
          border: '2px solid #22d3ee',
          boxShadow: '0 0 25px rgba(34, 211, 238, 0.5)'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#fff' }}>CHAT HỖ TRỢ</h1>
          <p style={{ color: '#22d3ee', margin: 0, fontSize: '15px' }}>GHN.PI Neon • Trợ lý On-chain 24/7</p>
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div style={{
        background: '#1e2937',
        borderRadius: '24px',
        border: '2px solid #334155',
        height: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)'
      }}>
        {/* Messages Area */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e2937 100%)'
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: '18px',
                background: msg.isUser ? '#22d3ee' : '#334155',
                color: msg.isUser ? '#0f172a' : '#e2e8f0',
                borderBottomRightRadius: msg.isUser ? '4px' : '18px',
                borderBottomLeftRadius: msg.isUser ? '18px' : '4px',
                boxShadow: msg.isUser ? '0 4px 15px rgba(34, 211, 238, 0.4)' : 'none'
              }}>
                {msg.text && <p style={{ margin: '0 0 8px 0' }}>{msg.text}</p>}
                {msg.file && (
                  <div style={{ marginTop: '8px' }}>
                    {msg.file.type.startsWith('image/') ? (
                      <img src={msg.file.url} alt={msg.file.name} style={{ maxWidth: '100%', borderRadius: '12px' }} />
                    ) : (
                      <div style={{ padding: '10px', background: '#0f172a', borderRadius: '10px' }}>
                        📎 {msg.file.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', paddingLeft: '4px' }}>
                {msg.time}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div style={{ padding: '12px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #334155' }}>
          {["Cách nhận hàng?", "Thanh toán Pi?", "Khiếu nại đơn", "Tra cứu cước phí"].map((q, i) => (
            <button key={i} onClick={() => setInputMessage(q)} style={{
              background: '#0f172a', color: '#22d3ee', border: '1px solid #22d3ee',
              padding: '8px 16px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer'
            }}>
              {q}
            </button>
          ))}
        </div>

        {/* INPUT AREA */}
        <div style={{ padding: '16px', background: '#1e2937', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} 
            style={{
              width: '48px', height: '48px', background: '#0f172a', color: '#22d3ee',
              border: '2px solid #22d3ee', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '28px', cursor: 'pointer'
            }}
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
            style={{
              flex: 1, padding: '16px 20px', background: '#0f172a',
              border: '1px solid #475569', borderRadius: '999px',
              color: 'white', fontSize: '16px', outline: 'none'
            }}
          />

          <button onClick={sendMessage} style={{
            width: '52px', height: '52px', background: '#22d3ee',
            color: '#0f172a', border: 'none', borderRadius: '999px',
            fontSize: '22px', cursor: 'pointer'
          }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}