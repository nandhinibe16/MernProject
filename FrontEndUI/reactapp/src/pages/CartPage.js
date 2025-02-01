import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useCart } from "../contexts/CartContext";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container className="mt-5">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Row>
          {cart.map((item) => (
            <Col key={item._id} md={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={item.imageUrl} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Price: ₹{item.price}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <Button variant="danger" onClick={() => removeFromCart(item._id)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div className="mt-4">
        <h4>Total: ₹{calculateTotal()}</h4>
        <Button variant="success" disabled={cart.length === 0}>
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
};

export default CartPage;