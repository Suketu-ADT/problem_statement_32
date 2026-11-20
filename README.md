# Problem Statement 32: College Rulebook Q&A

A Streamlit and Python app for asking questions about a college handbook. It extracts text from an uploaded PDF, retrieves relevant passages locally with TF-IDF, and asks Groq to answer using only those passages with page citations.

The Groq API key is read by the Python app from `.env`. It is not displayed in the interface or sent to the browser. The `.env` file is excluded from Git.

## Requirements

- Python 3.10 or newer
- A Groq API key
- A text-based college handbook PDF (scanned image-only PDFs need OCR first)

## Run on Windows PowerShell

From this folder, run:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m streamlit run streamlit_app.py
```

Add your key to `.env` before starting the app:

```env
GROQ_API_KEY=your_groq_key_here
```

The app opens at `http://localhost:8501`. It uses Groq model `openai/gpt-oss-120b` by default. You can override it with `GROQ_CHAT_MODEL` in `.env`; restart the app after changing environment settings.

## Try the sample

Upload `sample_college_handbook.pdf` from this folder, or download it from the app sidebar. It contains clearly marked fictional rules for testing retrieval and page citations. Do not rely on it as a real college policy document.

Try questions such as:

- What attendance percentage is required for final exams?
- How do I request exam revaluation?
- What are the library opening hours?
- Who should I contact about a disciplinary issue?
- What is the tuition late fee?
- What is the process for requesting medical leave?
- What is the hostel curfew on weekends?
- How many library books can I borrow?
- What happens if I miss an internal assessment?
- What time does the computer lab close?

## Project files

- `streamlit_app.py` — Streamlit interface, PDF extraction, local retrieval, and Groq answer generation.
- `sample_college_handbook.pdf` — fictional test handbook.
- `.env` — private Groq key; never commit or share this file.
- `requirements.txt` — Python dependencies.
