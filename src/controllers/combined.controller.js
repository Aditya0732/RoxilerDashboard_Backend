const axios = require('axios');

exports.getCombinedData = async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 5 } = req.query;
    console.log("query",req.query);
    console.log("page",page);
    const baseUrl = `http://localhost:3000/api`;

    const [statistics, barChartData, pieChartData] = await Promise.all([
      axios.get(`${baseUrl}/statistics?month=${month}`),
      axios.get(`${baseUrl}/bar-chart?month=${month}`),
      axios.get(`${baseUrl}/pie-chart?month=${month}`),
    ]);

    const productsResponse = await axios.get(`${baseUrl}/products?month=${month}&search=${search}&page=${page}&perPage=${perPage}`);
    const combinedData = {
      products: productsResponse?.data,
      statistics: statistics?.data,
      barChartData: barChartData?.data,
      pieChartData: pieChartData?.data,
    };
    res.json(combinedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};