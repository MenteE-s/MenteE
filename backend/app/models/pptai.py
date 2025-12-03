from datetime import datetime
from extensions import db


class Presentation(db.Model):
    __tablename__ = "presentations"

    id = db.Column(db.String(36), primary_key=True)  # UUID
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.Text, nullable=False)
    slide_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default="generating")  # generating, completed, error
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship("User", back_populates="presentations")

    slides = db.relationship("Slide", back_populates="presentation", cascade="all, delete-orphan")
    files = db.relationship("PPTAIFile", back_populates="presentation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Presentation {self.id} - {self.title}>"


class Slide(db.Model):
    __tablename__ = "slides"

    id = db.Column(db.Integer, primary_key=True)
    presentation_id = db.Column(db.String(36), db.ForeignKey("presentations.id"), nullable=False)
    slide_number = db.Column(db.Integer, nullable=False)
    html_content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    presentation = db.relationship("Presentation", back_populates="slides")

    def __repr__(self):
        return f"<Slide {self.presentation_id}-{self.slide_number}>"


class PPTAIFile(db.Model):
    __tablename__ = "pptai_files"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    presentation_id = db.Column(db.String(36), db.ForeignKey("presentations.id"), nullable=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # html, pdf, image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="pptai_files")
    presentation = db.relationship("Presentation", back_populates="files")

    def __repr__(self):
        return f"<PPTAIFile {self.filename}>"