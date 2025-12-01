from __future__ import annotations

import json
from datetime import datetime, date
from typing import Any, Dict

from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import BadRequest

from ..models import db, User, Experience, Education, Project, Skill


def parse_date(date_str: str | None) -> date | None:
    if not date_str or date_str.strip().lower() == "present":
        return None
    candidate = date_str.split("T")[0]
    for fmt in ("%Y-%m-%d", "%b %Y", "%B %Y", "%m/%Y", "%Y"):
        try:
            return datetime.strptime(candidate.strip(), fmt).date()
        except ValueError:
            continue
    print(f"DEBUG: Could not parse date string: {date_str}")
    return None


def current_user() -> User:
    identity = get_jwt_identity()
    try:
        user_id = int(identity)
    except (TypeError, ValueError):  # pragma: no cover - defensive
        raise BadRequest("Invalid user identity in token")
    user = User.query.get(user_id)
    if not user:
        raise BadRequest("User not found")
    return user


def serialize_experience(exp: Experience) -> Dict[str, Any]:
    return {
        "id": exp.id,
        "jobTitle": exp.title,
        "company": exp.company,
        "location": exp.location,
        "startDate": exp.start_date.isoformat() if exp.start_date else None,
        "endDate": exp.end_date.isoformat() if exp.end_date else None,
        "description": exp.description,
        "employmentType": exp.employment_type,
        "current": exp.current_job,
    }


def serialize_education(edu: Education) -> Dict[str, Any]:
    return {
        "id": edu.id,
        "institution": edu.institution,
        "degree": edu.degree,
        "location": edu.location,
        "field": edu.field,
        "startDate": edu.start_date.isoformat() if edu.start_date else None,
        "endDate": edu.end_date.isoformat() if edu.end_date else None,
        "description": edu.description,
    }


def serialize_project(proj: Project) -> Dict[str, Any]:
    try:
        technologies = json.loads(proj.technologies or "[]")
    except (TypeError, ValueError):
        technologies = []
    return {
        "id": proj.id,
        "title": proj.name,
        "description": proj.description,
        "link": proj.demo_url or proj.github_url,
        "technologies": technologies,
    }


def serialize_skill(skill: Skill) -> Dict[str, Any]:
    return {"skill_id": skill.id, "skill_name": skill.name}


def profile_payload(user: User) -> Dict[str, Any]:
    experiences = (
        Experience.query.filter_by(user_id=user.id)
        .order_by(Experience.start_date.desc().nullslast())
        .all()
    )
    educations = (
        Education.query.filter_by(user_id=user.id)
        .order_by(Education.start_date.desc().nullslast())
        .all()
    )
    projects = (
        Project.query.filter_by(user_id=user.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    skills = (
        Skill.query.filter_by(user_id=user.id)
        .order_by(Skill.created_at.desc())
        .all()
    )
    return {
        "profile_id": user.id,
        "personalDetails": {
            "fullName": user.name,
            "email": user.email,
            "phone": user.phone,
            "location": user.location,
            "linkedin": user.linkedin_url,
            "github": user.github_url,
            "website": user.website_url,
        },
        "summary": user.summary,
        "experience": [serialize_experience(exp) for exp in experiences],
        "education": [serialize_education(edu) for edu in educations],
        "projects": [serialize_project(proj) for proj in projects],
        "skills": [serialize_skill(skill) for skill in skills],
    }
