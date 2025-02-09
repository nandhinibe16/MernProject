import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Table, Modal, Row, Col, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";

const UploadProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products per page

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        { name, price, description, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
      fetchProducts();
    } catch (error) {
      toast.error("Product upload failed");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.warning("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
        console.error(error);
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImageUrl(product.imageUrl);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${currentProduct._id}`,
        { name, price, description, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product updated successfully");
      setShowModal(false);
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <Container className="mt-5 p-4 border rounded bg-light">
      <h2 className="mb-4">Upload Product</h2>
      <Form onSubmit={handleUpload}>
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={1} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" variant="primary" className="w-100">Upload</Button>
          </Col>
        </Row>
      </Form>

      <h3 className="mt-5">Product List</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product._id}>
              <td>
                <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} width="50" height="50" />
              </td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.description}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(product)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(product._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages).keys()].map((num) => (
          <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UploadProduct;