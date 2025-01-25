// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Navbar() {
  return (
    <nav style={{ backgroundColor: '#FFB81C', padding: '10px' }}>
      <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around' }}>
        <li>
          <Link to="/calendar" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
            Calendar
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
