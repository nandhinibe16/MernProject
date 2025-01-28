import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import UploadProduct from './pages/UploadProduct';
import ShopProducts from './pages/ShopProducts';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
       <Route path="/upload-product" element={<ProtectedRoute><UploadProduct /></ProtectedRoute>} />
       <Route path="/shop-products" element={<ShopProducts />} />
       <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
