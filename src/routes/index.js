const express = require('express');
const productController = require('../controllers/product.controller');
const statisticsController = require('../controllers/statistics.controller');
const combinedController = require('../controllers/combined.controller');

const router = express.Router();

router.get('/products', productController.getProducts);
router.get('/statistics', statisticsController.getStatistics);
router.get('/bar-chart', statisticsController.getBarChartData);
router.get('/pie-chart', statisticsController.getPieChartData);
router.get('/combined', combinedController.getCombinedData);

module.exports = router;