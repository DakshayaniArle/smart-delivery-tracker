import React from "react";

const Orders = ({ orders, onBack }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <button onClick={onBack} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Back</button>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="flex gap-4 border p-4 rounded-xl shadow bg-white">
              <img src={order.image} alt={order.name} className="w-24 h-24 object-contain" />
              <div>
                <h3 className="text-xl font-semibold">{order.name}</h3>
                <p>{order.description}</p>
                <p className="font-bold">{order.cost}</p>
                <p className="font-bold">order Status:</p>
                <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
