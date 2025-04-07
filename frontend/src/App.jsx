import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
//import Login from './components/Login';
//import Register from './components/Register';
import Main from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protect the dashboard route */}
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
