// src/pages/ChatPage.tsx
import React, { useState } from 'react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: "admin", text: "Chào bạn! Bạn cần hỗ trợ gì hôm nay?", time: "10:32" },
    { id: 2, from: "me", text: "Tôi muốn hỏi về phí vận chuyển đường dài", time: "10:33" },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      from: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <div style={pageContainer}>
      <div style={header}>
        <div style={{ fontSize: '42px' }}>💬</div>
        <h1 style={title}>HỖ TRỢ CHAT</h1>
        <p style={subtitle}>CSKH GHN.PI</p>
      </div>

      <div style={chatContainer}>
        {messages.map(msg => (
          <div key={msg.id} style={msg.from === 'me' ? myMessage : adminMessage}>
            <div style={msgBubble}>
              {msg.text}
            </div>
            <span style={timeStyle}>{msg.time}</span>
          </div>
        ))}
      </div>

      <div style={inputArea}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..." 
          style={inputStyle} 
        />
        <button onClick={sendMessage} style={sendButton}>Gửi</button>
      </div>
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box' as const,
  display: 'flex',
  flexDirection: 'column' as const
};

const header = { textAlign: 'center' as const, marginBottom: '20px' };
const title = { fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8' };

const chatContainer = {
  flex: 1,
  overflowY: 'auto' as const,
  padding: '10px 0',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px'
};

const myMessage = { alignSelf: 'flex-end' as const, maxWidth: '75%' };
const adminMessage = { alignSelf: 'flex-start' as const, maxWidth: '75%' };

const msgBubble = {
  padding: '12px 16px',
  borderRadius: '18px',
  fontSize: '15.5px'
};

const myMessageBubble = { ...msgBubble, background: '#22d3ee', color: '#0f172a' };
const adminMessageBubble = { ...msgBubble, background: '#fff', border: '1px solid #c4b5fd', color: '#4c1d95' };

const timeStyle = { fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' };

const inputArea = {
  position: 'fixed' as const,
  bottom: '70px',
  left: '14px',
  right: '14px',
  display: 'flex',
  gap: '8px',
  background: '#f3e8ff',
  padding: '8px 0'
};

const inputStyle = {
  flex: 1,
  padding: '14px 16px',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  background: '#ede9fe',
  fontSize: '16px'
};

const sendButton = {
  padding: '14px 24px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '700'
};

export default ChatPage;