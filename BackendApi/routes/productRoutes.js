const { protect } = require('../middleware/authMiddleware'); 
const Product = require('../models/Product'); 
const express = require('express');

const router = express.Router(); 

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


router.get('/', async (req, res) => {
    try {
      const products = await Product.find(); 
      res.json(products); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  router.put('/:id', protect, async (req, res) => {
    try {
      const { name, price, description, imageUrl } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, description, imageUrl },
        { new: true }
      );
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  router.delete('/:id', protect, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });
  

module.exports = router;
