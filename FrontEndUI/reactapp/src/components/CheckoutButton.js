import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const CheckoutButton = ({ amount }) => {
  const handlePayment = async () => {
    try {
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
  return <Button variant="success" onClick={handlePayment}>Proceed to Checkout ₹{amount}</Button>;
};

export default CheckoutButton;