import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const navigate = useNavigate();
  
  // Login state
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });
  
  // Register state
  const [regData, setRegData] = useState({ 
    name: '', 
    email: '', 
    password: ''
  });
  
  const [error, setError] = useState('');

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  // Handle register form changes
  const handleRegChange = (e) => {
    setRegData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Password confirmation check
    if (regData.password !== regData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regData.name,
          email: regData.email,
          password: regData.password
        }),
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Section - Login */}
      <div className="w-full md:w-1/2 bg-cover bg-center flex items-center justify-center p-8"   style={{ backgroundImage: "url('../assets/login.jpg')" }}>
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Section - Register */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join us today and get started with your journey</p>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="reg-name"
                name="name"
                value={regData.name}
                onChange={handleRegChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Your Name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={regData.email}
                onChange={handleRegChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="reg-password"
                name="password"
                value={regData.password}
                onChange={handleRegChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="reg-confirm-password"
                name="confirmPassword"
                value={regData.confirmPassword}
                onChange={handleRegChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 transform hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;