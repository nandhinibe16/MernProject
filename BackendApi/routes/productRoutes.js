const { protect } = require('../middleware/authMiddleware'); // Destructure protect
const Product = require('../models/Product'); 
const express = require('express');

const router = express.Router(); 

// Use protect middleware
router.post('/add', protect, async (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, price, description, imageUrl });
    await product.save();
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.json(products); // Send the product data in the response
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  

module.exports = router;
