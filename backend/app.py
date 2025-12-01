"""Legacy runner kept for convenience.

This file previously contained a duplicate app factory registering only the
RecruAI blueprint, which caused divergence from the unified factory in
`app/__init__.py` (where CVAI and compatibility auth blueprints are
registered). Running `python app.py` therefore omitted `/api/cvai` and
`/api/login` routes, producing 404 responses. Simplify by delegating to the
canonical factory.
"""

import os
from app import create_app, app  # unified factory & pre-created app instance

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=os.getenv("FLASK_DEBUG", "1") == "1")
