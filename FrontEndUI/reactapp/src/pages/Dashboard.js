import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Pagination } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "react-toastify";
import moment from 'moment';
const itemsPerPage = 5;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    priceRange: { min: 0, max: 0 },
    savedProducts: [],
    totalOrders: 0,
    orders: [],
  });
  const totalPages = Math.ceil(stats.orders.length / itemsPerPage);
  const paginatedOrders = stats.orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchUserAndData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        localStorage.setItem("userId", userRes.data._id);

        const [productRes, savedRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/productstats'),
          axios.get(`http://localhost:5000/api/dashboard/user/${userRes.data._id}/saved-products`),
          axios.get('http://localhost:5000/api/dashboard/orders/stats')
        ]);

        setStats({
          totalProducts: productRes.data?.totalProducts || 0,
          priceRange: productRes.data?.priceRange || { min: 0, max: 0 },
          savedProducts: savedRes.data || [],
          totalOrders: orderRes.data?.totalOrders || 0,
          orders: orderRes.data?.orderDetails || [],
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
            <h5>Total Orders</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: "Orders", count: stats.totalOrders }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5>Order Amounts</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.orders.map(order => ({ 
                name: `Order ${order._id.substring(order._id.length - 4)}`,
                amount: order.totalAmount 
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-3">
            <h5>Order Details</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Items</th>
                  <th>Order Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(order._id.length - 6)}</td>
                    <td>{order.items.length}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.status}</td>
                    <td>{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="justify-content-center">
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                  {num + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;
