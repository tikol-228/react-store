import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './layouts/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Contacts from './pages/Contacts'
import ForgotPassword from './pages/ForgotPassword'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import ProductDetails from './pages/ProductDetails'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Защищённые маршруты (для авторизованных пользователей) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />

            {/* Админ маршруты (для администраторов) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
