const DashboardFactory = require("../services/dashboardFactory");

const dashboardService = DashboardFactory.createService("dashboard");

exports.getProductStats = async (req, res) => {
  try {
    const stats = await dashboardService.getProductStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSavedProducts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const savedProducts = await dashboardService.getUserSavedProducts(userId);
    res.json(savedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const stats = await dashboardService.getOrderStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
