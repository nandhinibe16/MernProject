import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

const Dashboard = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); 
      } catch (err) {
        console.error('Failed to fetch user:', err);
        alert('Failed to fetch user. Redirecting to login.');
        localStorage.removeItem('token'); 
        window.location.href = '/login'; 
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="text-center mt-5">
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Your email: {user.email}</p>
        </>
      ) : (
        <p>Failed to load user data.</p>
      )}
    </Container>
  );
};

export default Dashboard;
