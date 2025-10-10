export default function ReviewerStatsCard({ label, count, variant = 'default' }) {
  const getStyles = () => {
    switch (variant) {
      case 'pending':
        return { bg: '#DBEAFE', textColor: '#1E3A8A', borderColor: '#BFDBFE' };
      case 'changes':
        return { bg: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' };
      case 'forwarded':
        return { bg: '#D1FAE5', textColor: '#065F46', borderColor: '#A7F3D0' };
      case 'rejected':
        return { bg: '#FEE2E2', textColor: '#991B1B', borderColor: '#FECACA' };
      default:
        return { bg: '#F3F4F6', textColor: '#1F2937', borderColor: '#E5E7EB' };
    }
  };
  const styles = getStyles();
  return (
    <div style={{
      backgroundColor: styles.bg,
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${styles.borderColor}`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '36px', fontWeight: '700', color: styles.textColor }}>{count}</div>
    </div>
  );
}
