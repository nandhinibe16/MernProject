const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/productstats", dashboardController.getProductStats);
router.get("/user/:userId/saved-products", dashboardController.getUserSavedProducts);
router.get("/orders/stats", dashboardController.getOrderStats);

module.exports = router;
