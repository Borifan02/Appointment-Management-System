import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_BASE}/auth/register`, { name, email, password }, { withCredentials: true });
      window.location.href = '/';
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Create account</button>
    </form>
  );
}
