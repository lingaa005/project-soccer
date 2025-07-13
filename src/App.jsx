import React, { useState, useEffect } from 'react';
import { supabase } from './api/supabaseClient';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './assets/styles/App.css';

const App = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        setSession(session);
        
        if (session) {
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching session or profile:", error);
      
        setSession(null);
        setProfile(null);
      } finally {
       
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  
  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        Loading...
      </div>
    );
  }

  
  return (
    <div>
      {!session ? <LoginPage /> : <HomePage userProfile={profile} />}
    </div>
  );
};

export default App;