import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import UploadProduct from './pages/UploadProduct';
import ShopProducts from './pages/ShopProducts';
import CartPage from './pages/CartPage';
import Header from './components/Header';  
import { useCart } from "./contexts/CartContext";

function App() {
  const location = useLocation();
  const { addToCart } = useCart();
  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Header />}
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
        <Route
          path="/upload-product"
          element={
            <ProtectedRoute>
              <UploadProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/shop-products" element={<ShopProducts onAddToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
