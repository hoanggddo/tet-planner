import React, { useState } from 'react';

function Budget() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budgetItems, setBudgetItems] = useState([]);

  const handleAddItem = () => {
    if (!amount || !description) {
      alert('Please provide both amount and description.');
      return;
    }

    // Add a new item to the budgetItems array
    const newItem = { amount: parseFloat(amount), description };
    setBudgetItems([...budgetItems, newItem]);
    setAmount('');
    setDescription('');
  };

  const handleRemoveItem = (index) => {
    const updatedItems = budgetItems.filter((_, itemIndex) => itemIndex !== index);
    setBudgetItems(updatedItems);
  };

  // Calculate the total amount
  const totalAmount = budgetItems.reduce((total, item) => total + item.amount, 0);

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFB81C', borderRadius: '10px' }}>
      <h2>Manage Your Budget</h2>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: '5px', margin: '10px' }}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '5px', margin: '10px' }}
          required
        />
      </div>
      <button
        onClick={handleAddItem}
        style={{
          padding: '10px',
          backgroundColor: '#FF6900',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Add Item
      </button>
      <hr />
      <h3>Budget Items</h3>
      <ul>
        {budgetItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <strong>{item.description}</strong>: ${item.amount.toFixed(2)}
            <button
              onClick={() => handleRemoveItem(index)}
              style={{
                backgroundColor: '#D84A00',
                color: '#fff',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
    </div>
  );
}

export default Budget;
