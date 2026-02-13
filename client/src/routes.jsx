import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './screens/HomePage.jsx';
import ProductPage from './screens/ProductPage.jsx';
import CartPage from './screens/CartPage.jsx';
import CheckoutPage from './screens/CheckoutPage.jsx';
import LoginPage from './screens/LoginPage.jsx';
import RegisterPage from './screens/RegisterPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:id', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
