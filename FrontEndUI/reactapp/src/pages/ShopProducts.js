import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Pagination } from 'react-bootstrap';

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 

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
        key: 'your_razorpay_key_id', 
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

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="mt-5">
      <Row>
        {currentProducts.map((product) => (
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

      <Pagination className="mt-4 justify-content-center custom-pagination">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};

export default ShopProducts;