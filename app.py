from pathlib import Path
import re
import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent
html = (ROOT / "index.html").read_text(encoding="utf-8")

def inline_script(match):
    source = match.group(1)
    code = (ROOT / source).read_text(encoding="utf-8")
    return f'<script type="text/babel">{code}</script>'

html = re.sub(
    r'<script type="text/babel" src="\.\/([^"]+)"></script>',
    inline_script,
    html,
)

st.set_page_config(page_title="BoltPrep AI", layout="wide")
st.markdown(
    """
    <style>
        header[data-testid="stHeader"],
        [data-testid="stToolbar"],
        [data-testid="stDecoration"],
        #MainMenu,
        footer {
            display: none;
        }

        html, body, .stApp, [data-testid="stAppViewContainer"], [data-testid="stMain"] {
            background: #f8fafc;
        }

        .block-container, .stMainBlockContainer {
            max-width: none;
            padding: 0 !important;
        }

        [data-testid="stVerticalBlock"] {
            gap: 0;
        }

        iframe {
            display: block;
            width: 100%;
            border: 0;
        }
    </style>
    """,
    unsafe_allow_html=True,
)
components.html(html, height=950, scrolling=True)
