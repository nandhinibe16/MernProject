import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShopProducts = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

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
            <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
              <Card.Img
                variant="top"
                src={`http://localhost:5000${product.imageUrl}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Price: ₹{product.price}</Card.Text>
                <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="mt-4 justify-content-center">
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

      <div className="mt-4 text-center">
        <Link to="/cart">
          <Button variant="success">Go to Cart</Button>
        </Link>
      </div>
    </Container>
  );
};

export default ShopProducts;