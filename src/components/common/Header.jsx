import React from 'react';
import { supabase } from '../../api/supabaseClient';

const Header = () => {
  const handleLogout = async () => {
   
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <h1>Player Dashboard</h1>
      <button onClick={handleLogout} className="button">
        Logout
      </button>
    </header>
  );
};

export default Header;