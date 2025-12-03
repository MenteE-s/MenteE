from flask import Blueprint, request, jsonify, stream_with_context, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
from app.services.pptai.slide_generator import SlideGenerator
from app.services.pptai.pdf_exporter import PDFExporter

bp = Blueprint('pptai', __name__)

@bp.route('/generate', methods=['POST'])
@jwt_required(locations=["headers"])  # force header-only tokens to avoid CSRF-related 422s
def generate_presentation():
    """Server-Sent Events endpoint to generate a presentation step-by-step."""
    data = request.get_json(silent=True) or {}
    topic = data.get('topic')
    slide_count = data.get('slide_count', 5)
    user_id = get_jwt_identity()

    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    generator = SlideGenerator(user_id)

    def event_stream():
        try:
            # Step 1: Planning Agent
            plan = generator.plan_slides(topic, slide_count)
            yield f'data: {json.dumps({"status": "plan_generated", "plan": plan})}\n\n'

            # Step 2: Wait for user approval
            approval = data.get('approval')
            if not approval:
                # Inform client approval is required, then end stream
                yield f'data: {json.dumps({"status": "error", "message": "Approval required to proceed"})}\n\n'
                return

            # Step 3: Content and Image Agents
            for slide_html, slide_number in generator.generate_slides(topic, slide_count):
                yield f'data: {json.dumps({"status": "slide_generated", "slide_number": slide_number, "slide_html": slide_html})}\n\n'

            # Step 4: Finalization Agent
            generator.finalize_presentation()
            yield f'data: {json.dumps({"status": "presentation_finalized"})}\n\n'
        except Exception as e:
            yield f'data: {json.dumps({"status": "error", "message": str(e)})}\n\n'

    return Response(stream_with_context(event_stream()), mimetype='text/event-stream')

@bp.route('/download/<presentation_id>', methods=['GET'])
@jwt_required()
def download_presentation(presentation_id):
    try:
        user_id = get_jwt_identity()
        exporter = PDFExporter(user_id)
        pdf_path = exporter.export_to_pdf(presentation_id)

        if not os.path.exists(pdf_path):
            return jsonify({'error': 'Presentation not found'}), 404

        return {
            'download_url': f'/api/pptai/download-file/{presentation_id}',
            'filename': f'presentation_{presentation_id}.pdf'
        }, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/download-file/<presentation_id>', methods=['GET'])
@jwt_required()
def download_file(presentation_id):
    try:
        user_id = get_jwt_identity()
        exporter = PDFExporter(user_id)
        pdf_path = exporter.get_pdf_path(presentation_id)

        if not os.path.exists(pdf_path):
            return jsonify({'error': 'File not found'}), 404

        return exporter.send_file(pdf_path, f'presentation_{presentation_id}.pdf')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/chat', methods=['POST'])
@jwt_required()
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')
        presentation_id = data.get('presentation_id')
        user_id = get_jwt_identity()

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        generator = SlideGenerator(user_id)
        response = generator.process_chat_message(message, presentation_id)

        return jsonify({'response': response}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/list', methods=['GET'])
@jwt_required()
def list_presentations():
    try:
        user_id = get_jwt_identity()
        generator = SlideGenerator(user_id)
        presentations = generator.list_user_presentations()

        return jsonify({'presentations': presentations}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def stream_updates(agent, *args, **kwargs):
    """Stream updates from an agent to the frontend."""
    try:
        for update in agent(*args, **kwargs):
            yield f'data: {json.dumps(update)}\n\n'
    except Exception as e:
        yield f'data: {json.dumps({"status": "error", "message": str(e)})}\n\n'
