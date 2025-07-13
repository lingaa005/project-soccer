import React, { useState } from 'react';
import Header from '../components/common/Header';
import PlayerList from '../components/players/PlayerList';
import PlayerSkills from '../components/players/PlayerSkills';


const HomePage = ({ userProfile }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const handleSelectPlayer = (id) => {
    setSelectedPlayerId(id);
  };

  return (
    <div>
      <Header />
      <main className="app-container">
        
        {}
        {userProfile && userProfile.role === 'coach' && (
          <div style={{ marginBottom: '1rem' }}>
            <button className="button">Add New Player</button>
          </div>
        )}

        <div className="players-container">
          <PlayerList onSelectPlayer={handleSelectPlayer} />
          <PlayerSkills playerId={selectedPlayerId} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;