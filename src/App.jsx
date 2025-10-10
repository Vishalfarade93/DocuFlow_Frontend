import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SubmitterPage from './components/SubmitterPage';
import ReviewerPage from './components/ReviewerPage';
import ApproverPage from './components/ApproverPage';
import ProtectedRoute from './components/ProtectedRoute';
import ViewDocument from './components/Submitter/ViewDocument';
import ViewDocumentPage from './components/Submitter/ViewDocument';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/submit" 
          element={
            <ProtectedRoute requiredRole="SUBMITTERS">
              <SubmitterPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/review" 
          element={
            <ProtectedRoute requiredRole="REVIEWERS">
              <ReviewerPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/approve" 
          element={
            <ProtectedRoute requiredRole="APPROVERS">
              <ApproverPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;