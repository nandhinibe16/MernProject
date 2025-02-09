const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

class DashboardService {
  async getProductStats() {
    try {
      const totalProducts = await Product.countDocuments();
      const products = await Product.find({}, "price"); 
      console.log("products");
      console.log(products);

      if (products.length === 0) {
        return { totalProducts, priceRange: { min: null, max: null } };
      }
      const prices = products.map((p) => p.price);
      const priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
      console.log("products priceRange");
      console.log(priceRange);
      return { totalProducts, priceRange };
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw new Error("Failed to fetch product stats");
    }
  }

  async getUserSavedProducts(userId) {
    try {    
      const userOrders = await Order.find({ user: userId }).select("items").lean();
      
      const productIds = new Set();
      userOrders.forEach(order => {
        order.items.forEach(item => productIds.add(item.product.toString()));
      });
      const savedProducts = await Product.find({ _id: { $in: Array.from(productIds) } });
      console.log("savedProducts Details:", savedProducts);
  
      return { savedProductsCount: savedProducts.length, savedProducts };
    } catch (error) {
      console.error("Error fetching user saved products:", error);
      throw new Error("Failed to fetch saved products");
    }
  }
  
  

  async getOrderStats() {
    try {
      
      const totalOrders = await Order.countDocuments();
      const orderDetails = await Order.find();      
      console.log("totalorderDetails");
      console.log(orderDetails);
      return { totalOrders, orderDetails };
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw new Error("Failed to fetch order stats");
    }
  }
}

module.exports = DashboardService;
