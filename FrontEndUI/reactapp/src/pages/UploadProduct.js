import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const UploadProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/products/add',
        { name, price, description, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (error) {
      alert('Product upload failed');
      console.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Upload Product</h2>
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Upload</Button>
      </Form>
    </Container>
  );
};

export default UploadProduct;
