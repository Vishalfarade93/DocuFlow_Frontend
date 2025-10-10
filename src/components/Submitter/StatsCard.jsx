export default function StatsCard({ label, count, variant = 'default' }) {
  const getStyles = () => {
    switch (variant) {
      case 'total':
        return { bg: 'white', textColor: '#1F2937', borderColor: '#E5E7EB' };
      case 'drafts':
        return { bg: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' };
      case 'submitted':
        return { bg: '#EFF6FF', textColor: '#1E3A8A', borderColor: '#DBEAFE' };
      case 'review':
        return { bg: '#FEF3C7', textColor: '#78350F', borderColor: '#FDE68A' };
      case 'reupload':
        return { bg: '#FEF2F2', textColor: '#991B1B', borderColor: '#FECACA' };
      case 'approved':
        return { bg: '#F0FDF4', textColor: '#166534', borderColor: '#BBF7D0' };
      case 'rejected':
        return { bg: '#FEF2F2', textColor: '#991B1B', borderColor: '#FECACA' };
      default:
        return { bg: '#F9FAFB', textColor: '#1F2937', borderColor: '#E5E7EB' };
    }
  };

  const styles = getStyles();

  return (
    <div style={{
      backgroundColor: styles.bg,
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${styles.borderColor}`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '700', color: styles.textColor }}>{count}</div>
    </div>
  );
}