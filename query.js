const express = require('express');
const app = express();
const { products } = require('./data'); 

app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home Page</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #e9f5f5;
          margin: 0;
          padding: 0;
        }
        header {
          background: #003135;
          color: #fff;
          text-align: center;
          padding: 20px 0;
        }
        h1 {
          margin: 0;
          font-size: 2.5em;
        }
        h2 {
          color: #024950;
          margin: 10px 0;
        }
        .container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        a {
          text-decoration: none;
          color: #024950;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        .price-range, .view-all, .search-bar {
          margin: 20px 0;
          text-align: center; /* Center the elements */
        }
        .price-range ul {
          list-style: none;
          padding: 0;
          display: flex;
          justify-content: space-around;
        }
        .price-range li {
          background: #0fa4af;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .price-range li:hover {
          background: #024950;
        }
        .view-all button, .search-bar button {
          background-color: #0fa4af;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          transition: background 0.3s;
        }
        .view-all button:hover, .search-bar button:hover {
          background-color: #024950;
        }
        .search-bar input {
          padding: 10px;
          width: 60%;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Welcome to Our Product Store</h1>
        <h2>Your one-stop shop for amazing products</h2>
      </header>
      <div class="container">
        <h2>Filter Products by Price Range</h2>
        <div class="price-range">
          <ul>
            <li><a href="/api/products/range/10/20">$10 - $20</a></li>
            <li><a href="/api/products/range/20/30">$20 - $30</a></li>
            <li><a href="/api/products/range/30/40">$30 - $40</a></li>
            <li><a href="/api/products/range/10/50">$10 - $50</a></li>
          </ul>
        </div>
        <div class="view-all">
          <a href="/api/products"><button>View All Products</button></a>
        </div>
        <div class="search-bar">
          <form action="/api/search" method="get">
            <input type="text" name="query" placeholder="Search for products...">
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/products', (req, res) => {
  let productHTML = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Products</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .product-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        .product {
          background: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 15px;
          flex: 1 1 calc(30% - 20px);
          box-sizing: border-box;
          transition: transform 0.2s;
        }
        .product:hover {
          transform: scale(1.05);
        }
        img {
          max-width: 100%;
          border-radius: 5px;
        }
        .product h2 {
          font-size: 1.5em;
          color: #024950;
        }
        .product p {
          color: #555;
        }
        .price {
          font-size: 1.2em;
          color: #964734;
        }
        @media (max-width: 768px) {
          .product {
            flex: 1 1 calc(45% - 20px); /* Two products per row on smaller screens */
          }
        }
        @media (max-width: 480px) {
          .product {
            flex: 1 1 100%; /* One product per row on mobile */
          }
        }
      </style>
    </head>
    <body>
      <h1>Products</h1>
      <div class="product-container">
  `;

  products.forEach((product) => {
    productHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p class="price"><strong>Price:</strong> $${product.price}</p>
        <p>${product.desc}</p>
      </div>
    `;
  });

  productHTML += `
      </div>
    </body>
    </html>
  `;

  res.send(productHTML);
});

// Search route
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  if (searchResults.length < 1) {
    return res.status(404).send(`
      <h1>No products found for search query "${query}"</h1>
    `);
  }

  let productHTML = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Search Results</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .product-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        .product {
          background: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 15px;
          flex: 1 1 calc(30% - 20px);
          box-sizing: border-box;
          transition: transform 0.2s;
        }
        .product:hover {
          transform: scale(1.05);
        }
        img {
          max-width: 100%;
          border-radius: 5px;
        }
        .product h2 {
          font-size: 1.5em;
          color: #024950;
        }
        .product p {
          color: #555;
        }
        .price {
          font-size: 1.2em;
          color: #964734;
        }
      </style>
    </head>
    <body>
      <h1>Search Results for "${query}"</h1>
      <div class="product-container">
  `;

  searchResults.forEach((product) => {
    productHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p class="price"><strong>Price:</strong> $${product.price}</p>
        <p>${product.desc}</p>
      </div>
    `;
  });

  productHTML += `
      </div>
    </body>
    </html>
  `;

  res.send(productHTML);
});

// Price range filter route
app.get('/api/products/range/:minPrice/:maxPrice', (req, res) => {
  const { minPrice, maxPrice } = req.params;
  const filteredProducts = products.filter(product =>
    product.price >= minPrice && product.price <= maxPrice
  );

  if (filteredProducts.length < 1) {
    return res.status(404).send(`
      <h1>No products found in the price range $${minPrice} - $${maxPrice}</h1>
    `);
  }

  let productHTML = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Products in Price Range</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .product-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        .product {
          background: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 15px;
          flex: 1 1 calc(30% - 20px);
          box-sizing: border-box;
          transition: transform 0.2s;
        }
        .product:hover {
          transform: scale(1.05);
        }
        img {
          max-width: 100%;
          border-radius: 5px;
        }
        .product h2 {
          font-size: 1.5em;
          color: #024950;
        }
        .product p {
          color: #555;
        }
        .price {
          font-size: 1.2em;
          color: #964734;
        }
      </style>
    </head>
    <body>
      <h1>Products in the price range $${minPrice} - $${maxPrice}</h1>
      <div class="product-container">
  `;

  filteredProducts.forEach((product) => {
    productHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p class="price"><strong>Price:</strong> $${product.price}</p>
        <p>${product.desc}</p>
      </div>
    `;
  });

  productHTML += `
      </div>
    </body>
    </html>
  `;

  res.send(productHTML);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
