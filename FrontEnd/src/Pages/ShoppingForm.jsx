// ShoppingListForm.jsx
import React, { useState } from 'react';

const ShoppingListForm = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', { name, quantity });
  
    // Ensure name is non-empty and quantity is a valid positive number
    if (!name.trim() || isNaN(quantity) || quantity <= 0) {
      setMessage('Please enter a valid item name and quantity.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, quantity: parseInt(quantity, 10) }),
      });
  
      console.log('Response status:', response.status); // Log response status
  
      if (response.ok) {
        setMessage('Item added successfully!');
        // Use function form to avoid stale closures
        setName(() => '');
        setQuantity(() => 1);
      } else {
        const data = await response.json();
        const errorMessage = data.error || 'Unknown error occurred.';
        setMessage(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log fetch errors
      setMessage('Failed to add item. Please try again later.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Shopping List Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Add Item
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListForm;
