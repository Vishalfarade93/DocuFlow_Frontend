import { LogOut } from 'lucide-react';
import { useState } from 'react';
import NotificationPanel from '../NotificationPanel';
import NotificationBell from '../NotificationBell';
import useNotifications from '../../hooks/useNotifications';

export default function Navbar({ onLogOut }) {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fffffff0',
          zIndex: 1000,
          padding: '0 130px'
        }}
      >
        {/* Left Side - App Title & Username */}
        <div>
          <p style={{ marginBottom: '-10px', fontSize: '23px', marginTop: '10px', fontWeight: 'bold', color: '#000000ff' }}>
            DocuFlow
          </p>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'normal',
              color: '#6B7280',
              display: 'flex',
              justifyContent: 'center',
              fontFamily: 'Pacifico'
            }}
          >
            {user.username || 'Submitter'}
          </div>
        </div>

        {/* Right Side - Notification Bell & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Notification Bell */}
          <div
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <NotificationBell unreadCount={unreadCount} />
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1F2937',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              height: '40px',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAllNotifications}
      />
    </>
  );
}
