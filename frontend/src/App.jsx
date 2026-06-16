import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';

function AppContent() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();

  // Load cart state from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('ecommerceCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('ecommerceCart', JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.product === product._id);

    if (existingItem) {
      if (existingItem.qty < product.countInStock) {
        const newCart = cart.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item
        );
        saveCart(newCart);
        alert(`Increased quantity of ${product.name}`);
      } else {
        alert('Cannot add more items. Maximum stock reached.');
      }
    } else {
      const newCart = [
        ...cart,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
          countInStock: product.countInStock,
        },
      ];
      saveCart(newCart);
      alert(`${product.name} added to cart!`);
    }
  };

  const changeQty = (productId, amount) => {
    let newCart = cart.map((item) => {
      if (item.product === productId) {
        const newQty = item.qty + amount;
        if (newQty > item.countInStock) {
          alert(`Only ${item.countInStock} items available in stock`);
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    });

    // Remove item if quantity falls to 0 or below
    newCart = newCart.filter((item) => item.qty > 0);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <Navbar
        cartCount={totalCartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Shop addToCart={addToCart} searchInput={searchInput} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/myorders" element={<MyOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Routes>

      {/* Cart Modal Overlay */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        changeQty={changeQty}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal Overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        clearCart={clearCart}
        onOrderSuccess={() => navigate('/myorders')}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
