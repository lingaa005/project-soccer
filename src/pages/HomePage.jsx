import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import Header from '../components/common/Header';
import PlayerList from '../components/players/PlayerList';
import PlayerSkills from '../components/players/PlayerSkills';
import VideoUploader from '../components/players/VideoUploader'; // We will create this new component

const HomePage = ({ userProfile }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This state is a simple trick to force a refresh of the skills component
  const [analysisVersion, setAnalysisVersion] = useState(0);

  // Fetch players from the database when the component loads
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('players').select('*');
      if (error) {
        console.error('Error fetching players:', error);
      } else {
        setPlayers(data);
      }
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  const handleSelectPlayer = (id) => {
    setSelectedPlayerId(id);
  };

  // This function will be called by the uploader when analysis is done
  const handleAnalysisComplete = () => {
    console.log("Analysis complete, triggering skill refresh.");
    setAnalysisVersion(prevVersion => prevVersion + 1);
  };

  const handleAddPlayer = async (playerName) => {
    if (!playerName) {
      alert("Player name cannot be empty.");
      return;
    }
    // Insert new player and refresh the list
    const { data, error } = await supabase.from('players').insert({ name: playerName }).select();
    if (error) {
      alert(error.message);
    } else {
      setPlayers(prevPlayers => [...prevPlayers, ...data]);
    }
  };

  if (loading) {
    return <div>Loading Players...</div>;
  }

  return (
    <div>
      <Header />
      <main className="app-container">
        
        {/* We only show management tools to a coach */}
        {userProfile && userProfile.role === 'coach' && (
          <div className="coach-controls" style={{ backgroundColor: 'var(--secondary-bg)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h2 style={{marginTop: 0}}>Coach Tools</h2>
            
            {/* Add Player Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddPlayer(e.target.playerName.value); e.target.reset(); }}>
              <input name="playerName" className="input-field" placeholder="New Player Name" style={{width: 'auto', marginRight: '1rem'}}/>
              <button type="submit" className="button">Add Player</button>
            </form>
            <hr style={{border: '1px solid var(--border-color)', margin: '1.5rem 0'}}/>

            {/* Video Uploader Component */}
            <VideoUploader 
              players={players} 
              onAnalysisComplete={handleAnalysisComplete} 
            />
          </div>
        )}

        <div className="players-container">
          <PlayerList players={players} onSelectPlayer={handleSelectPlayer} />
          <PlayerSkills playerId={selectedPlayerId} analysisVersion={analysisVersion} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;