const express = require("express");
const PaymentServiceFactory = require("../services/paymentServiceFactory");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.post("/submit-order", async (req, res) => {
  try {
    console.log("submit-order");

    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.json({ success: true, order: savedOrder });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentService = PaymentServiceFactory.getPaymentService("razorpay");
    const order = await paymentService.createOrder(amount, currency);
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { order_id, payment_id, razorpay_signature, userId, items, totalAmount } = req.body;
    
    const paymentService = PaymentServiceFactory.getPaymentService("razorpay");
    const isValid = await paymentService.verifyPayment({ order_id, payment_id, razorpay_signature });

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const paymentDetails = await paymentService.getPaymentDetails(payment_id);
    const paymentStatus = paymentDetails.status;

    const orderStatus = paymentStatus === "captured" ? "Paid" : "Failed";

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      status: orderStatus,
      payment_id
    });

    await order.save();

    res.json({ success: true, message: "Payment verified and order saved!", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
