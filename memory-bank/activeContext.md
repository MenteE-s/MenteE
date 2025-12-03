# Active Context

## Current Goals

- Fixed JWT authentication issue where `/api/v1/auth/me` was returning 422 because JWT_TOKEN_LOCATION was not configured to accept tokens from headers.

## Recent Fixes

- **JWT Header Configuration**: Added `JWT_TOKEN_LOCATION = ['headers']` to `app.py` so Flask-JWT-Extended accepts Bearer tokens from the Authorization header (frontend sends token this way, but backend was only looking in cookies by default).

## Current Blockers

- None
