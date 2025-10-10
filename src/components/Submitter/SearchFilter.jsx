import { Search, List, Grid } from 'lucide-react';

export default function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9CA3AF' 
          }} 
        />
        <input
          type="text"
          placeholder="Search documents by title"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{
          padding: '10px 40px 10px 12px',
          border: '1px solid #D1D5DB',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
      >
        <option value="All Status">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="REUPLOAD">Reupload</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* <button
          onClick={() => onViewChange('list')}
          style={{
            padding: '10px',
            border: view === 'list' ? '2px solid #1F2937' : '1px solid #D1D5DB',
            borderRadius: '8px',
            backgroundColor: view === 'list' ? '#F3F4F6' : 'white',
            cursor: 'pointer'
          }}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => onViewChange('grid')}
          style={{
            padding: '10px',
            border: view === 'grid' ? '2px solid #1F2937' : '1px solid #D1D5DB',
            borderRadius: '8px',
            backgroundColor: view === 'grid' ? '#F3F4F6' : 'white',
            cursor: 'pointer'
          }}
        >
          <Grid size={18} />
        </button> */}
      </div>
    </div>
  );
}
