// Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-custom-color text-white py-4">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-bold mb-2">Contributors</h2>
        <ul className="list-none flex justify-center space-x-4 mb-2">
          <li>Harshith</li>
          <li>Joseph</li>
          <li>Likhith</li>
          <li>Aravind</li>
        </ul>
        <div className="mt-4">
          <span>AyurVision &copy; 2024</span>
        </div>
      </div>
    </footer>
  );
}
