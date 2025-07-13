import React from 'react';
const playerSkillsData = {
1: { name: 'Lionel Messi', skills: { Dribbling: 95, Passing: 92, 'Average Goals': 0.85 } },
2: { name: 'Cristiano Ronaldo', skills: { Dribbling: 88, Passing: 82, 'Average Goals': 0.95 } },
3: { name: 'Kevin De Bruyne', skills: { Dribbling: 86, Passing: 94, 'Average Goals': 0.45 } },
};
const PlayerSkills = ({ playerId }) => {
if (!playerId) {
return (
<div className="player-skills">
<h2>Player Skills</h2>
<p>Select a player from the list to see their skills.</p>
</div>
);
}
const playerData = playerSkillsData[playerId];
return (
<div className="player-skills">
<h2>{playerData.name}'s Skills</h2>
<table className="skills-table">
<thead>
<tr>
<th>Skill</th>
<th>Rating / Value</th>
</tr>
</thead>
<tbody>
{Object.entries(playerData.skills).map(([skill, value]) => (
<tr key={skill}>
<td>{skill}</td>
<td>{value}</td>
</tr>
))}
</tbody>
</table>
</div>
);
};
export default PlayerSkills;
