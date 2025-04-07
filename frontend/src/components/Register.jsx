import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            onChange={handleChange}
            required
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            name="email"
            onChange={handleChange}
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            name="password"
            onChange={handleChange}
            required
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Register;
