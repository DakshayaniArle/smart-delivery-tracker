import React, { useState } from "react";
import Header from "./components/Header";
import ItemList from "./components/ItemList";
import OrderModal from "./components/OrderModal";
import Orders from "./components/Orders";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const handlePlaceOrder = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleConfirmOrder = (formData) => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder = { ...formData, ...selectedItem, orderId };
    setOrders((prev) => [...prev, newOrder]);
    setShowModal(false);
  };

  return <>
    

    <div className="font-sans">
      <Header onShowOrders={() => setShowOrders(true)} />
      {!showOrders && <ItemList onPlaceOrder={handlePlaceOrder} />}
      {showOrders && <Orders orders={orders} onBack={() => setShowOrders(false)} />}
      {showModal && (
        <OrderModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  </>;
};

export default App;