const Product = require('../models/product.model');

exports.getProducts = async (month, search, page, perPage) => {
  const query = { dateOfSale: { $regex: new RegExp(month, 'i') } };

  if (search) {
    query.$or = [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { price: { $regex: new RegExp(search, 'i') } },
    ];
  }

  const skip = (page - 1) * perPage;
  const limit = parseInt(perPage);

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit);

  return products;
};