const Razorpay = require("razorpay");
require("dotenv").config();

class RazorpayPaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount, currency) {
    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
      payment_capture: 1, 
    };

    return await this.razorpay.orders.create(options);
  }

  async verifyPayment(paymentDetails) {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    
    hmac.update(paymentDetails.order_id + "|" + paymentDetails.payment_id);
    const calculatedSignature = hmac.digest("hex");

    return calculatedSignature === paymentDetails.razorpay_signature;
  }

  async getPaymentDetails(payment_id) {
    return await this.instance.payments.fetch(payment_id);
  }
  
}

class PaymentServiceFactory {
  static getPaymentService(provider) {
    switch (provider) {
      case "razorpay":
        return new RazorpayPaymentService();
      default:
        throw new Error("Invalid payment provider");
    }
  }
}

module.exports = PaymentServiceFactory;