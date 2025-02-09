const DashboardService = require("./dashboardService");

const DashboardFactory = {
  createService: (type) => {
    if (type === "dashboard") {
      return new DashboardService();
    }
    throw new Error("Invalid service type");
  },
};

module.exports = DashboardFactory;
