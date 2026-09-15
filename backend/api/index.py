"""Vercel serverless entrypoint for the SFlyra FastAPI backend.

Vercel hosts this file at `{project-url}/api/*` and forwards the full request
path to the handler, so the app's own `/api/health`, `/api/chat`,
`/api/agents` routes are served unchanged.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402