from flask import jsonify
from . import api_bp

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'RecruAI Backend is running!',
        'version': '1.0.0'
    })

@api_bp.route('/test-db', methods=['GET'])
def test_database():
    try:
        import psycopg2
        import os
        
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users;")
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': 'Database connected successfully!',
            'user_count': count
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Database connection failed: {str(e)}'
        }), 500