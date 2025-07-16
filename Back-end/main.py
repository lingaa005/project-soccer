import os
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

# Load variables from your .env file
load_dotenv()

# --- Supabase Initialization ---
# Get your Supabase credentials from the .env file
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

# Create the Supabase client. We use the powerful service key here.
supabase: Client = create_client(url, key)

# --- FastAPI App Initialization ---
app = FastAPI()

# --- Mock Analysis Logic ---
# This is a placeholder for the real analysis logic from the other team.
def mock_video_analysis(video_url: str):
    import time
    print(f"Starting fake analysis on video from: {video_url}...")
    time.sleep(5)  # Simulate a 5-second analysis process
    print("Analysis complete.")
    # Return a dictionary of the analyzed metrics
    return [
        {"skill_name": "Dribbling", "skill_value": 92},
        {"skill_name": "Passing", "skill_value": 85},
        {"skill_name": "Shooting", "skill_value": 88},
        {"skill_name": "Pace", "skill_value": 90},
    ]
    
# --- API Request Model ---
# This defines the data structure the frontend MUST send to this API.
class VideoAnalysisRequest(BaseModel):
    player_id: int
    video_path: str

# --- API Endpoint ---
# This is the main function of your backend.
@app.post("/analyze-video")
def analyze_video(request: VideoAnalysisRequest):
    print(f"Received request to analyze video for player ID: {request.player_id} at path: {request.video_path}")

    try:
        # Step 1: Get the full public URL for the video from Supabase Storage
        public_url_response = supabase.storage.from_("video-uploads").get_public_url(request.video_path)
        
        # Step 2: Run the analysis logic on that video URL
        analyzed_skills = mock_video_analysis(public_url_response)

        # Step 3: Prepare the results to be saved in the database
        skills_to_insert = [
            {
                "player_id": request.player_id, 
                "skill_name": skill["skill_name"], 
                "skill_value": skill["skill_value"]
            } for skill in analyzed_skills
        ]

        # Step 4: Save the new skills data into the 'player_skills' table.
        # 'upsert' is smart: it updates a skill if it exists, or creates it if it's new.
        data, error = supabase.table("player_skills").upsert(skills_to_insert).execute()

        if error:
            # If Supabase gives an error, we stop and report it.
            raise HTTPException(status_code=500, detail=f"Supabase error: {error.message}")

        return {"message": f"Successfully analyzed and updated skills for player {request.player_id}", "data": data}

    except Exception as e:
        # If any other error happens, we report it.
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))