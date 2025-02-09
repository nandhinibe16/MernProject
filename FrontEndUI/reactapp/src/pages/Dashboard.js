import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    priceRange: { min: 0, max: 0 },
    savedProducts: [],
    totalOrders: 0,
    orders: [],
  });

  useEffect(() => {
    const fetchUserAndData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch user data first
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        localStorage.setItem("userId", userRes.data._id);

        // Fetch dashboard data
        const [productRes, savedRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/productstats'),
          axios.get(`http://localhost:5000/api/dashboard/user/${userRes.data._id}/saved-products`),
          axios.get('http://localhost:5000/api/dashboard/orders/stats')
        ]);

        console.log('productRes:', productRes.data);
        console.log('savedRes:', savedRes.data);
        console.log('orderRes:', orderRes.data);

        setStats({
          totalProducts: productRes.data?.totalProducts || 0,
          priceRange: productRes.data?.priceRange || { min: 0, max: 0 },
          savedProducts: savedRes.data?.savedProducts || [],
          totalOrders: orderRes.data?.totalOrders || 0,
          orders: Array.isArray(orderRes.data?.orderDetails) ? orderRes.data.orderDetails : [],
        });

      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to fetch data. Redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {user && <h2 className="text-center">Welcome, {user.name}!</h2>}

      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h5>Total Products Available</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Products", count: stats.totalProducts }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5>Price Range of Products</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { range: "Min Price", price: stats.priceRange?.min ?? 0 },
                { range: "Max Price", price: stats.priceRange?.max ?? 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h5>Saved Products</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Saved", count: stats.savedProducts.length }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5>Total Orders</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Orders", count: stats.totalOrders }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;