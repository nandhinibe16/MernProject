const express = require("express");
const crypto = require("crypto");
const PaymentServiceFactory = require("../services/paymentServiceFactory");
const Order = require("../models/Order");
const router = express.Router();

router.post("/webhook", async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];
  const payload = JSON.stringify(req.body);

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");

  if (calculatedSignature !== signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body.event;
  const paymentDetails = req.body.payload.payment.entity;

  try {
    if (event === "payment.captured") {
      const { order_id, payment_id } = paymentDetails;

      const order = await Order.findOne({ "payment_id": payment_id });
      if (!order) {
        return res.status(400).json({ success: false, message: "Order not found" });
      }

      order.status = "Paid";
      await order.save();

      console.log("Payment captured for order", order_id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
