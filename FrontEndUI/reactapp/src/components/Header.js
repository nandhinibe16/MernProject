import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import './Header.css'; 

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Navbar className="radiant-green-navbar" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Shopping Cart</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/shop-products">Shop Products</Nav.Link>
          <Nav.Link as={Link} to="/upload-product">Upload Product</Nav.Link>
          <Nav.Link>
            {user ? `Hello, ${user.name}` : 'Guest'}
          </Nav.Link>
          {user && (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
