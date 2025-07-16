import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';

// This component now fetches its own data based on the selected player
const PlayerSkills = ({ playerId, analysisVersion }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if a playerId is selected
    if (!playerId) {
      setSkills([]);
      return;
    }

    const fetchSkills = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('player_skills')
        .select('skill_name, skill_value')
        .eq('player_id', playerId);
      
      if (error) {
        console.error('Error fetching skills:', error);
      } else {
        setSkills(data);
      }
      setLoading(false);
    };

    fetchSkills();
  }, [playerId, analysisVersion]); // The key part: This effect re-runs when playerId changes OR when analysisVersion changes

  if (!playerId) {
    return (
      <div className="player-skills">
        <h2>Player Skills</h2>
        <p>Select a player from the list to see their skills.</p>
      </div>
    );
  }

  return (
    <div className="player-skills">
      {loading ? (
        <p>Loading Skills...</p>
      ) : (
        <>
          <h2>Skills</h2>
          {skills.length > 0 ? (
            <table className="skills-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.skill_name}>
                    <td>{skill.skill_name}</td>
                    <td>{skill.skill_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No skills data found for this player. A coach can upload a video to generate them.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PlayerSkills;