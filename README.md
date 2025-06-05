# FactCheck AI

This repository contains the browser extension **FactCheck AI** and its server back-end.
The project aims to highlight factual claims on web pages and verify them via
OpenAI and public search engines. See [TECH_SPEC_RU.md](TECH_SPEC_RU.md) for the
full Russian specification. A basic UI mock is available in
[DESIGN_RU.md](DESIGN_RU.md).

## Structure

```
extension/    # Browser extension (Manifest V3)
server/       # FastAPI server
```

## Quick start

Create a virtual environment and install the server dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt
```

Run the development server:

```bash
uvicorn server.app:app --reload
```

Run the tests:

```bash
pytest
```
