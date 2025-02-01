const express = require("express");
const PaymentServiceFactory = require("../services/paymentServiceFactory");
const router = express.Router();

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
    const paymentDetails = req.body;
    const paymentService = PaymentServiceFactory.getPaymentService("razorpay");
    const isValid = await paymentService.verifyPayment(paymentDetails);

    if (isValid) {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
