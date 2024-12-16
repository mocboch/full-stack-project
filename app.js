// app.js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // Add this line
const app = express();
const mysql = require('mysql2');
const port = 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Set up EJS and express-ejs-layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'Home');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'techtrove_db'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});
// Routes
app.get('/', (req, res) => {
    res.render('Home', {
        title: 'Home',
        page: 'home',
        layout: 'Home'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        page: 'contact',
        layout: 'contact'
    });
});
app.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products',
        page: 'products',
        layout: 'products'
    });
});

app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM Products', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server - listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access locally via: http://localhost:${port}`);
    console.log(`Access from other computers via: http://<your-ip-address>:${port}`);
});