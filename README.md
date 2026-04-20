# BoltPrep AI

A lightweight open-source quiz training app for certification prep.

## Features
- Custom syllabus and keyword-based classification
- Practice mode and exam mode
- Separate wrong-book tracking for practice and exam
- Star-marked questions
- Progress resume and jump-to-question
- Optional bilingual translation with Groq or Gemini API key

## Quick Start (Local)
1. Open a terminal in this folder.
2. Run:
   c:/MyCodes/fastframe/.venv/bin/python.exe -m http.server 5500
3. Visit:
   http://localhost:5500/index.html

Note: Do not open index.html via file://, use a local server.

## Project Structure
- index.html
- src/constants.js
- src/logo.js
- src/api.js
- src/app.jsx
- src/components/navbar.js
- src/components/question-card.js
- src/components/settings-modal.js

## Configuration
- Upload a question-bank JSON from the main page.
- Optional API key for translation:
  - Groq (recommended): starts with gsk_
  - Gemini

## Open Source
Contributions are welcome. See CONTRIBUTING.md.

## License
MIT, see LICENSE.
