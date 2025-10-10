export default function ReviewerNavbar({ onLogout }) {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  return (
    <div style={{
          display: 'flex',
                justifyContent: 'space-between',
                height: '80px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, backgroundColor: '#fffffff0',
                zIndex: 1000
    }}>
      <div style={{  marginLeft: '130px', fontWeight: 'bold', fontSize: '20px', color: '#000000ff', }}>
        
        <div>
          <p style={{ marginBottom: '-10px' ,fontSize:'23px', marginTop:'10px'}}>DocuFlow</p>
          <div style={{ fontSize: '20px', fontWeight: 'normal', color: '#6B7280', display: 'flex', justifyContent: 'center',fontFamily:'Pacifico' }}>{user.username}</div>
        </div>
      </div>
      <button
        onClick={onLogout}
        style={{
          marginRight: '130px', padding: '8px 16px', backgroundColor: '#1F2937', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', height: '40px', marginTop: '17px', fontWeight: 'bold', fontSize: '14px'
        }}
      >
        Logout
      </button>
    </div>
  );
}
