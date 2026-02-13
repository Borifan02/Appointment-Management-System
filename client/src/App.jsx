import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MERN Shop</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">© {new Date().getFullYear()} MERN Shop</footer>
    </div>
  );
}

export default App;
