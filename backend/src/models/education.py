from datetime import datetime

from extensions import db


class Education(db.Model):
    __tablename__ = "educations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    institution = db.Column(db.String(255), nullable=False)
    degree = db.Column(db.String(255), nullable=True)
    field = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    gpa = db.Column(db.String(10), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="educations")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "institution": self.institution,
            "degree": self.degree,
            "field": self.field,
            "location": self.location,
            "description": self.description,
            "gpa": self.gpa,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
