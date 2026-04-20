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
1. Clone this repository, then open a terminal in the project folder.
2. Start a local server (choose one):
   - python -m http.server 5500
   - py -m http.server 5500 (Windows)
3. Visit:
   - http://localhost:5500/index.html

`localhost` means your own computer, so each contributor runs it locally after cloning.

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
