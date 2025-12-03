#!/bin/bash
# Start script for Railway
exec gunicorn main:app --bind 0.0.0.0:${PORT:-5000}
