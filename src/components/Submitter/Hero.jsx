import { Plus } from 'lucide-react';
import StatsCard from './StatsCard';

export default function Hero({ stats, onUploadClick }) {
  return (
    <div style={{ margin: '30px 130px 0 130px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>
            My Documents
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            Manage and track your document submissions
          </p>
        </div>
        <button
          onClick={onUploadClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#1F2937',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Upload New Document
        </button>
      </div>

 
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '16px', 
        marginBottom: '30px' 
      }}>
        <StatsCard label="Total Documents" count={stats.total} variant="total" />
        <StatsCard label="Drafts" count={stats.drafts} variant="drafts" />
        <StatsCard label="Submitted for review" count={stats.submitted} variant="submitted" />
        <StatsCard label="Changes Requested" count={stats.reupload} variant="reupload" />
        <StatsCard label="Sent For Approval" count={stats.underReview} variant="review" />
        <StatsCard label="Approved" count={stats.approved} variant="approved" />
        <StatsCard label="Rejected" count={stats.rejected} variant="rejected" />
      </div>
    </div>
  );
}