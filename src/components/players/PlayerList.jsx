import React from 'react';

// This component is now much simpler. It just receives players and displays them.
const PlayerList = ({ players, onSelectPlayer }) => {
  return (
    <div className="player-list">
      <h2>Players</h2>
      {players.length > 0 ? (
        <ul>
          {players.map((player) => (
            <li key={player.id} onClick={() => onSelectPlayer(player.id)}>
              {player.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No players found. A coach can add players using the tools above.</p>
      )}
    </div>
  );
};

export default PlayerList;