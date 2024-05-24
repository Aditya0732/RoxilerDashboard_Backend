const axios = require('axios');
const Product = require('../models/product.model');

const fetchData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response?.data;
    await Product.deleteMany({});

    const products = data.map((item) => {
      const month = new Date(item.dateOfSale).getMonth() + 1;
      const monthStr = month.toString().padStart(2, '0');

      return new Product({
        ...item,
        dateOfSale: new Date(item.dateOfSale),
        month: monthStr,
      });
    });

    await Product.insertMany(products);
    console.log('Data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

module.exports = fetchData;