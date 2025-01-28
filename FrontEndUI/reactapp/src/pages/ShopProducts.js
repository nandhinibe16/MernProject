import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const ShopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = async (product) => {
    const amount = product.price;
    try {
      // Step 1: Create Razorpay order
      const response = await axios.post('http://localhost:5000/api/payments/create-order', { amount });
      const { id: orderId, currency } = response.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: 'your_razorpay_key_id', // Replace with your Razorpay key ID
        amount: amount * 100,
        currency: currency,
        name: 'My Shop',
        description: product.description,
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Step 3: Verify payment
          try {
            const verifyResponse = await axios.post('http://localhost:5000/api/payments/verify-payment', paymentData);
            if (verifyResponse.data.success) {
              alert('Payment Successful!');
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            alert('Error verifying payment');
            console.error(err);
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'your-email@example.com',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment failed', err);
      alert('Payment failed');
    }
  };

  return (
    <Container>
      <Row>
        {products.map((product) => (
          <Col key={product._id} md={4} className="mb-3">
            <Card>
              <Card.Img variant="top" src={product.imageUrl} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Price: ₹{product.price}</Card.Text>
                <Button onClick={() => handleBuyNow(product)}>Buy Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShopProducts;
