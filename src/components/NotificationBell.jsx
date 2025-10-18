import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotificationBell({ onClick, unreadCount }) {
  const [pulse, setPulse] = useState(false);

  // Trigger pulse animation
  useEffect(() => {
    if (unreadCount > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F3F4F6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Bell size={22} color="#374151" />
      
      {/* Badge with unread count */}
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#EF4444',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '10px',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            animation: pulse ? 'pulse 0.5s ease-in-out' : 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </button>
  );
}