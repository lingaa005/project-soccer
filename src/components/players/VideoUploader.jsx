import React, { useState } from 'react';
import { supabase } from '../../api/supabaseClient';

const VideoUploader = ({ players, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [sessionType, setSessionType] = useState('Practice'); // 'Practice' or 'Game'
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedPlayer) {
      alert('Please select a player and a video file.');
      return;
    }
    
    setLoading(true);

    try {
      // --- STEP 1: UPLOAD VIDEO TO SUPABASE STORAGE ---
      setStatusMessage('Uploading video...');
      const fileName = `${selectedPlayer}_${sessionType}_${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('video-uploads') // This must match the bucket name you created
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;
      
      const videoPath = uploadData.path;
      console.log('Video uploaded successfully. Path:', videoPath);

      // --- STEP 2: TRIGGER FASTAPI ANALYSIS ---
      setStatusMessage('Video uploaded. Starting analysis... (This may take a moment)');
      
      const response = await fetch('http://localhost:8000/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: parseInt(selectedPlayer), // Ensure player_id is an integer
          video_path: videoPath
        })
      });

      if (!response.ok) {
        // If the server response is not good, get the error detail
        const errorDetail = await response.json();
        throw new Error(errorDetail.detail || 'Analysis failed.');
      }
      
      const result = await response.json();
      console.log('FastAPI response:', result);

      setStatusMessage('✅ Analysis complete! Player skills have been updated.');
      onAnalysisComplete(); // Tell HomePage to refresh the skills data

    } catch (error) {
      console.error('An error occurred:', error);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Video for Analysis</h3>
      <form onSubmit={handleSubmit}>
        {/* Player Selection */}
        <div style={{marginBottom: '1rem'}}>
          <label>Player:</label>
          <select 
            className="input-field" 
            value={selectedPlayer} 
            onChange={(e) => setSelectedPlayer(e.target.value)}
            required
          >
            <option value="" disabled>Select a player</option>
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
            ))}
          </select>
        </div>

        {/* Session Type Selection */}
        <div style={{marginBottom: '1rem'}}>
          <label>Session Type:</label>
          <select 
            className="input-field"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <option value="Practice">Practice</option>
            <option value="Game">Game</option>
          </select>
        </div>
        
        {/* File Input */}
        <div style={{marginBottom: '1rem'}}>
          <label>Video File:</label>
          <input 
            type="file" 
            className="input-field"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Analyze'}
        </button>

        {statusMessage && <p style={{marginTop: '1rem'}}>{statusMessage}</p>}
      </form>
    </div>
  );
};

export default VideoUploader;