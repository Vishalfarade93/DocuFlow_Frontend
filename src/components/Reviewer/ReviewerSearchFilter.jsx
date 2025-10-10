import { Search, Grid, List } from 'lucide-react';

export default function ReviewerSearchFilter({ 
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
          placeholder="Search documents by title, description, or tags..."
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
        <option>All Status</option>
        <option>Pending Review</option>
        <option>Changes Requested</option>
        <option>Forwarded</option>
        <option>Rejected</option>
      </select>
    </div>
  );
}