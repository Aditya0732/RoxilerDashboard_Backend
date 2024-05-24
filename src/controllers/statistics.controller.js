const Product = require('../models/product.model');

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        const query = {
            $match: {
                month,
                sold: true,
            },
        };

        const totalSaleAmount = await Product.aggregate([
            query,
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' },
                },
            },
        ]);

        const soldItems = await Product.countDocuments({
            month,
            sold: true,
        });

        const notSoldItems = await Product.countDocuments({
            month,
            sold: false,
        });

        res.json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].total : 0,
            soldItems,
            notSoldItems,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBarChartData = async (req, res) => {
    try {
      const { month } = req.query;
      const ranges = [
        { range: "0-100", min: 0, max: 100 },
        { range: "101-200", min: 101, max: 200 },
        { range: "201-300", min: 201, max: 300 },
        { range: "301-400", min: 301, max: 400 },
        { range: "401-500", min: 401, max: 500 },
        { range: "501-600", min: 501, max: 600 },
        { range: "601-700", min: 601, max: 700 },
        { range: "701-800", min: 701, max: 800 },
        { range: "801-900", min: 801, max: 900 },
        { range: "901-above", min: 901, max: Infinity },
      ];
  
      const data = await Promise.all(
        ranges.map(async ({ range, min, max }) => {
          const count = await Product.countDocuments({
            month: month.toString(),
            price: { $gte: min, $lt: max },
          });
          return { range, count };
        })
      );
  
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;

        const pieChartData = await Product.aggregate([
            {
                $match: {
                    month,
                },
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1,
                },
            },
        ]);

        res.json(pieChartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};