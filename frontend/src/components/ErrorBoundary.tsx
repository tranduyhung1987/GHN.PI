import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    
    // Log to console in a way that's easy to see on Pi Browser
    console.error('=== GHN.PI ERROR BOUNDARY ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: '100vh',
          background: '#f8fafc'
        }}>
          <h2 style={{ color: '#4c1d95', marginBottom: '16px' }}>
            Đã xảy ra lỗi khi tải ứng dụng
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Vui lòng thử <strong>Hard Refresh</strong> (Ctrl + Shift + R) hoặc mở trong trình duyệt ẩn danh.
          </p>
          
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '16px',
            margin: '20px auto',
            maxWidth: '600px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#991b1b' }}>Chi tiết lỗi:</strong>
            <pre style={{ 
              marginTop: '8px',
              fontSize: '13px',
              color: '#7f1d1d',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </div>

          <button 
            onClick={this.handleReload} 
            style={{ 
              marginTop: '12px', 
              padding: '12px 24px', 
              background: '#4c1d95', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
