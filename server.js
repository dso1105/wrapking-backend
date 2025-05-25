const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const SECRET_KEY = 'wrapking_secret';

app.use(cors());
app.use(bodyParser.json());

// Init DB
const db = new sqlite3.Database('wrapking.db');

db.serialize(() => {
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, stock INTEGER, price REAL, visible INTEGER)");

});

// Middleware for verifying JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send('Invalid credentials');
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token });
  });
});

// CRUD: Products
// GET all products
app.get('/api/products', authenticateToken, (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// POST new product
app.post('/api/products', authenticateToken, (req, res) => {
    const { title, description, stock, price, visible } = req.body;
    db.run("INSERT INTO products (title, description, stock, price, visible) VALUES (?, ?, ?, ?, ?)",
        [title, description, stock, price, visible],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({ id: this.lastID });
        });
});

// PUT update product
app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { title, description, stock, price, visible } = req.body;
    db.run("UPDATE products SET title = ?, description = ?, stock = ?, price = ?, visible = ? WHERE id = ?",
        [title, description, stock, price, visible, req.params.id],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({ updated: this.changes });
        });
});


app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).send(err);
    res.json({ deleted: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Wrap King Admin API listening at http://localhost:${port}`);
});
