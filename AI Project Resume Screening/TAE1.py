import os
import io
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from pypdf import PdfReader
from docx import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify backend is running."""
    return {"status": "ok", "message": "Backend is running"}

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = Document(io.BytesIO(file_content))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculates cosine similarity between two texts using TF-IDF vectors."""
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(similarity * 100, 2)
    except Exception:
        return 0.0

@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Endpoint to analyze uploaded resume (PDF or DOCX) against a Job Description.
    Returns a match score based on feature vectors (TF-IDF) and detailed analysis using Gemini.
    """
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured on server.")
    
    content = await file.read()
    
    resume_text = ""
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        resume_text = extract_text_from_docx(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
        
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # Calculate Match Score using Feature Vectors (TF-IDF & Cosine Similarity)
    match_score = calculate_similarity(jd_text, resume_text)

    # Prompt for Gemini to get structured details
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    You are an expert HR AI. Analyze the resume against the provided Job Description (JD).
    
    Job Description:
    {jd_text[:2000]}... (truncated)

    Resume Text:
    {resume_text[:2000]}... (truncated)

    Task:
    1. Extract the candidate's name (or infer from filename '{filename}').
    2. Identify the candidate's current or most recent role.
    3. List matched skills (present in both JD and Resume) with a relevance score (0-100).
    4. Provide a brief professional feedback summary (2-3 sentences).
    5. List 3 key strengths relative to the JD.
    6. List 3 missing skills or weaknesses relative to the JD.

    Output must be valid JSON with this exact structure:
    {{
        "name": "Candidate Name",
        "role": "Current Role",
        "skills": [
            {{"name": "Skill 1", "match": 95}},
            {{"name": "Skill 2", "match": 80}}
        ],
        "aiFeedback": "Brief summary...",
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"]
    }}
    Do not include markdown formatting (```json). Just the raw JSON string.
    """
    
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
        analysis_data = json.loads(cleaned_response)
        
        # Merge the calculated score
        analysis_data["score"] = match_score
        
        # Determine match label
        if match_score >= 80:
            analysis_data["match"] = "Excellent"
        elif match_score >= 60:
            analysis_data["match"] = "Good"
        elif match_score >= 40:
            analysis_data["match"] = "Average"
        else:
            analysis_data["match"] = "Low"
            
        # Add avatar placeholder
        analysis_data["avatar"] = f"https://ui-avatars.com/api/?name={analysis_data.get('name', 'Candidate')}&background=random"

        return analysis_data
        
    except Exception as e:
        print(f"Error: {e}")
        # Fallback if AI fails, return basic score
        return {
            "name": filename,
            "role": "Candidate",
            "score": match_score,
            "match": "Average", # Default
            "skills": [],
            "aiFeedback": " AI analysis unavailable. Score based on keyword overlap.",
            "strengths": [],
            "weaknesses": [],
            "avatar": "https://ui-avatars.com/api/?name=Candidate&background=random"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)