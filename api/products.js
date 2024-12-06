const mongoose = require('mongoose');
const Product = require('../product'); // Giả sử bạn đã có model sản phẩm ở file product.js

// Kết nối MongoDB
const connectToDatabase = async() => {
    if (mongoose.connections[0].readyState) {
        return; // Nếu đã kết nối rồi thì không kết nối lại
    }

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = async(req, res) => {
    await connectToDatabase();

    // Định nghĩa các route API
    if (req.method === 'GET') {
        try {
            const products = await Product.find();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching products' });
        }
    }

    if (req.method === 'POST') {
        const { name, description, price, imageUrl } = req.body;
        try {
            const newProduct = new Product({ name, description, price, imageUrl });
            await newProduct.save();
            return res.status(201).json(newProduct);
        } catch (error) {
            return res.status(400).json({ error: 'Error creating product' });
        }
    }

    // Xử lý các phương thức khác như PUT, DELETE nếu cần
    return res.status(405).json({ error: 'Method Not Allowed' });
};