const DashboardFactory = require("../services/dashboardFactory");

const dashboardService = DashboardFactory.createService("dashboard");

exports.getProductStats = (req, res) => {
  const stats = dashboardService.getProductStats();
  res.json(stats);
};

exports.getUserSavedProducts = (req, res) => {
  const userId = req.params.userId;
  const savedProducts = dashboardService.getUserSavedProducts(userId);
  res.json(savedProducts);
};

exports.getOrderStats = (req, res) => {
  const stats = dashboardService.getOrderStats();
  res.json(stats);
};
