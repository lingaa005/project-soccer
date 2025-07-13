import React from 'react';


const players = [
  { id: 1, name: 'Lionel Messi' },
  { id: 2, name: 'Cristiano Ronaldo' },
  { id: 3, name: 'Kevin De Bruyne' },
];

const PlayerList = ({ onSelectPlayer }) => {
  return (
    <div className="player-list">
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id} onClick={() => onSelectPlayer(player.id)}>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;