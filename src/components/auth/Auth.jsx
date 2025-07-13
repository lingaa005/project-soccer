import React, { useState } from 'react';
import { supabase } from '../../api/supabaseClient';

const Auth = () => {
  
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Check your email for the confirmation link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLoginView ? 'Login' : 'Sign Up'}</h1>
      <p>{isLoginView ? 'Sign in to view the dashboard' : 'Create an account to get started'}</p>
      
      {}
      <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
        <input
          className="input-field"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" disabled={loading}>
          {loading ? 'Loading...' : (isLoginView ? 'Login' : 'Sign Up')}
        </button>
      </form>
      
      {/* This is the link that toggles between Login and Sign Up views */}
      <p style={{ marginTop: '1rem', color: '#ccd6f6' }}>
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <a 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            setIsLoginView(!isLoginView); 
          }}
          style={{ color: 'var(--highlight-color)', textDecoration: 'none' }}
        >
          {isLoginView ? 'Sign Up' : 'Login'}
        </a>
      </p>
    </div>
  );
};

export default Auth;