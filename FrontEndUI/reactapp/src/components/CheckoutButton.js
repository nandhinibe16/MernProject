import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useCart } from "../contexts/CartContext";

const CheckoutButton = ({ amount }) => {
  const { cart } = useCart(); 

  const handlePayment = async () => {
    try {

      const userId = localStorage.getItem("userId");     
      
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderResponse = await axios.post("http://localhost:5000/api/payments/submit-order", {
        userId,
        items,
        totalAmount: amount,
      });
      
      if (!orderResponse.data.success) {
        alert("Failed to save order. Try again.");
        return;
      }
      else
      {
        alert("Order saved successfully.");
      }

      const { data } = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount,
        currency: "INR",
      });

      const options = {
        key: "razorpay_key_id", 
        amount: data.order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Payment for order",
        order_id: data.order.id,
        handler: async (response) => {
          const paymentDetails = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: userId, 
            items: items, 
            totalAmount: amount,
          };

          const verifyRes = await axios.post("http://localhost:5000/api/payments/verify-payment", paymentDetails);
          
          if (verifyRes.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  return <Button variant="success" onClick={handlePayment}>Place Order ₹{amount}</Button>;
};

export default CheckoutButton;