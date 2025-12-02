# Add this to your app.py temporarily for testing

from flask import jsonify
import psycopg2
import os

import app

@app.route('/test-db')
def test_database():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users;")
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        return jsonify({
            "status": "success",
            "message": "Database connected!",
            "user_count": count
        })
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e)
        }), 500