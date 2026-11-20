# Problem Statement 32: College Rulebook Q&A

A local web app for asking questions about a college handbook. The frontend is built with HTML, CSS, and JavaScript. A small Flask server reads the PDF, finds relevant handbook passages locally with TF-IDF, then asks Groq to answer using those passages and cite their page numbers.

The Groq API key is read by the Python server from `.env`. It is not included in the HTML, CSS, JavaScript, or browser requests. Keep `.env` private; it is ignored by Git.

## Requirements

- Python 3.10 or newer
- A Groq API key
- A text-based college handbook PDF (image-only scanned PDFs need OCR first)

## Run on Windows PowerShell

Open PowerShell and run:

```powershell
Set-Location -LiteralPath "C:\path\to\problem_statement_32"
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m server
```

Before starting, add your key to `.env`:

```env
GROQ_API_KEY=your_groq_key_here
```

The app opens at `http://127.0.0.1:5000`. It accepts handbook PDFs up to 20 MB. The `.env` file is loaded by the server and must not be uploaded to GitHub.

The default chat model is `openai/gpt-oss-120b`. If you change `GROQ_CHAT_MODEL` in `.env`, restart the server for the change to take effect.

For a quick demo, upload `sample_college_handbook.pdf`. It contains clearly marked fictional rules for testing search and page citations; do not treat them as real college policies.

## How to use

1. Start the local server.
2. Upload the official handbook PDF.
3. Ask questions about attendance, examinations, conduct, or campus rules.
4. Review the answer and open the retrieved passages to verify the cited page.

Suggested demo questions (verify answers against your handbook):

1. What attendance percentage is required to sit for examinations?
2. What is the process for applying for medical leave?
3. What happens if a student misses an internal assessment?
4. What items are prohibited on campus?
5. What is the procedure for exam revaluation?
6. How can a student report a ragging or harassment incident?
7. What are the library opening hours?
8. What is the late fee for tuition payment?
9. What are the hostel entry and exit timings?
10. Who should a student contact about a disciplinary issue?

## Project files

- `server.py` — Flask API, local handbook retrieval, and Groq calls.
- `templates/index.html` — page structure.
- `static/styles.css` — responsive styling.
- `static/app.js` — upload flow, questions, and answer rendering.
- `sample_college_handbook.pdf` — fictional test handbook for app demos.
- `.env` — private Groq API key; never commit or share this file.
- `requirements.txt` — Python dependencies.

The server binds to `127.0.0.1` for local use. Uploaded PDFs and their search indexes are held in memory while the server is running.
