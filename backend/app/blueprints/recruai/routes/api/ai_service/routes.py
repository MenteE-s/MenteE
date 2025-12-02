from flask import Blueprint, request, jsonify
import os
import requests

ai_service_bp = Blueprint('ai_service', __name__)

@ai_service_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            return jsonify({'error': 'GROQ API key not configured'}), 500
        
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {groq_api_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'mixtral-8x7b-32768',
                'messages': [
                    {'role': 'system', 'content': 'You are an AI interview assistant.'},
                    {'role': 'user', 'content': message}
                ],
                'max_tokens': 1000,
                'temperature': 0.7
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({
                'response': result['choices'][0]['message']['content']
            })
        else:
            return jsonify({'error': 'AI service unavailable'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Register the blueprint with the parent api_bp
from .. import api_bp
api_bp.register_blueprint(ai_service_bp, url_prefix='/ai')