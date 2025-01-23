import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';

const Dashboard = () => {
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true); // Handles loading state

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // Update user state with API response
      } catch (err) {
        console.error('Failed to fetch user:', err);
        alert('Failed to fetch user. Redirecting to login.');
        localStorage.removeItem('token'); // Remove invalid token
        window.location.href = '/login'; // Redirect to login page
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    window.location.href = '/login'; // Redirect to login page
  };

  // Display loading text until user data is fetched
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  // Display user details if user is successfully fetched
  return (
    <Container className="text-center mt-5">
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Your email: {user.email}</p>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <p>Failed to load user data.</p>
      )}
    </Container>
  );
};

export default Dashboard;
