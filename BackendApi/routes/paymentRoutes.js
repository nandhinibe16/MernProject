const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    try {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
  
      if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'An error occurred during verification' });
    }
  });
module.exports = router;
