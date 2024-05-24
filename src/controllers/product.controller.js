const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 5 } = req.query;
    const skip = (page - 1) * perPage;
    const limit = parseInt(perPage);
    const query = { month };

    console.log("looking",search);
    if (search) {
      const isNumeric = !isNaN(parseFloat(search)) && isFinite(search);
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    
      if (isNumeric) {
        query.$or.push({ price: { $eq: parseFloat(search) } });
      } else {
        // If the search string is not a valid number, exclude the price field from the search
      }
    }

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    if (products.length === 0) {
      console.log("No products found for the given month and search criteria.");
    }

    const totalPages = Math.ceil(totalCount / limit);
    res.json({ products,page, totalCount, totalPages });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};