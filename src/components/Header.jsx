import React from "react";

const Header = ({ onShowOrders }) => {
  return (
    <header className="bg-blue-700 text-white flex justify-between items-center px-8 py-4 shadow">
         <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="logo" className="w-14 h-14" />
      <div className="flex gap-6 text-lg">
        <button className="hover:underline">Login</button>
        <button className="hover:underline" onClick={onShowOrders}>Orders</button>
        <button className="hover:underline">Account Details</button>
      </div>
     
    </header>
  );
};

export default Header;