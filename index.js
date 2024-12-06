const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb+srv://nthiennhan1611:XLMRXRXPVXbiB8Qm@cluster0.z0zjg.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Product = mongoose.model('Product', ProductSchema);

// Add Product
app.post('/add-product', (req, res) => {
    const { name, description, price } = req.body;

    const newProduct = new Product({ name, description, price });

    newProduct.save()
        .then(() => res.status(201).json(newProduct))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Get Products
app.get('/products', (req, res) => {
    Product.find()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Update product
app.put('/update-product/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    Product.findByIdAndUpdate(id, { name, description, price }, { new: true })
        .then(updatedProduct => res.status(200).json(updatedProduct))
        .catch(err => res.status(400).json({ error: err.message }));
});


// Delete product
app.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;

    Product.findByIdAndDelete(id)
        .then(() => res.send('Product deleted successfully'))
        .catch(err => res.status(400).send('Error deleting product: ' + err));
});


// Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});