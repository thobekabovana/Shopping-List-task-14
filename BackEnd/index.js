const http = require('http');
const fs = require('fs');
const path = require('path');

// File path for shopping list JSON
const FILE_PATH = path.join(__dirname, 'shopping-list.json');

// Helper: Read JSON file
const readShoppingList = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

// Helper: Write to JSON file
const writeShoppingList = (data) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

// API Server Setup
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Handle GET /shopping-list
  if (method === 'GET' && url === '/shopping-list') {
    const list = readShoppingList();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(list));
  }
  
  // Handle POST /shopping-list
  else if (method === 'POST' && url === '/shopping-list') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const newItem = JSON.parse(body);
      if (!newItem.name || newItem.quantity <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid item data' }));
      }
      const list = readShoppingList();
      list.push(newItem);
      writeShoppingList(list);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
    });
  }

  // Handle PUT /shopping-list/:index
  else if (method === 'PUT' && url.startsWith('/shopping-list/')) {
    const index = parseInt(url.split('/')[2]);
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const updatedItem = JSON.parse(body);
      const list = readShoppingList();

      if (index < 0 || index >= list.length) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Item not found' }));
      }

      list[index] = { ...list[index], ...updatedItem };
      writeShoppingList(list);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list[index]));
    });
  }

  // Handle DELETE /shopping-list/:index
  else if (method === 'DELETE' && url.startsWith('/shopping-list/')) {
    const index = parseInt(url.split('/')[2]);
    const list = readShoppingList();

    if (index < 0 || index >= list.length) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Item not found' }));
    }

    const removedItem = list.splice(index, 1);
    writeShoppingList(list);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(removedItem));
  }

  // Handle unknown routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
