from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import (
    current_user,
    parse_date,
    dump_technologies,
    load_technologies,
    handle_error,
    project_is_portfolio,
    project_is_regular,
    ser_experience,
    ser_education,
    ser_project,
    ser_award,
    ser_cert,
    ser_publication,
    ser_patent,
    ser_language,
    ser_volunteering,
    ser_interest,
    ser_social,
    ser_course,
    ser_reference,
)
from extensions import db
from app.models import (
    User,
    Experience,
    Education,
    Project,
    Skill,
    Award,
    Certification,
    Publication,
    Patent,
    Language,
    VolunteerExperience,
    HobbyInterest,
    SocialMediaLink,
    CourseTraining,
    Reference,
)


def _profile_payload(user: User):
    experiences = Experience.query.filter_by(user_id=user.id).order_by(Experience.start_date.desc().nullslast()).all()
    educations = Education.query.filter_by(user_id=user.id).order_by(Education.start_date.desc().nullslast()).all()
    projects_all = Project.query.filter_by(user_id=user.id).order_by(Project.created_at.desc()).all()
    skills = Skill.query.filter_by(user_id=user.id).order_by(Skill.created_at.desc()).all()
    awards = Award.query.filter_by(user_id=user.id).order_by(Award.date.desc().nullslast()).all()
    certs = Certification.query.filter_by(user_id=user.id).order_by(Certification.date_obtained.desc().nullslast()).all()
    pubs = Publication.query.filter_by(user_id=user.id).order_by(Publication.year.desc().nullslast()).all()
    patents = Patent.query.filter_by(user_id=user.id).order_by(Patent.grant_date.desc().nullslast()).all()
    languages = Language.query.filter_by(user_id=user.id).order_by(Language.created_at.desc()).all()
    volunteering = VolunteerExperience.query.filter_by(user_id=user.id).order_by(VolunteerExperience.start_date.desc().nullslast()).all()
    interests = HobbyInterest.query.filter_by(user_id=user.id).order_by(HobbyInterest.created_at.desc()).all()
    socials = SocialMediaLink.query.filter_by(user_id=user.id).order_by(SocialMediaLink.created_at.desc()).all()
    courses = CourseTraining.query.filter_by(user_id=user.id).order_by(CourseTraining.completion_date.desc().nullslast()).all()
    refs = Reference.query.filter_by(user_id=user.id).order_by(Reference.created_at.desc()).all()

    regular_projects = [p for p in projects_all if project_is_regular(p)]
    portfolio_items = [p for p in projects_all if project_is_portfolio(p)]

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
        "experience": [ser_experience(e) for e in experiences],
        "education": [ser_education(e) for e in educations],
        "projects": [ser_project(p) for p in regular_projects],
        "skills": ["" if not s.name else s.name for s in skills],
        "awards": [ser_award(a) for a in awards],
        "certifications": [ser_cert(c) for c in certs],
        "portfolio_items": [
            {
                "portfolio_item_id": p.id,
                "title": p.name,
                "description": p.description,
                "url": p.demo_url or p.github_url,
            }
            for p in portfolio_items
        ],
        "publications": [ser_publication(pub) for pub in pubs],
        "patents": [ser_patent(pt) for pt in patents],
        "languages": [ser_language(l) for l in languages],
        "volunteering": [ser_volunteering(v) for v in volunteering],
        "interests": [ser_interest(i) for i in interests],
        "social_profiles": [ser_social(s) for s in socials],
        "courses": [ser_course(c) for c in courses],
        "references": [ser_reference(r) for r in refs],
        "total_views": 0,
        "avg_score_percent": 0.0,
        "interviews_count": 0,
        "success_rate_percent": 0.0,
        "show_analytics": (user.plan or "trial").lower() == "pro",
    }


@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    try:
        user = current_user()
        return jsonify({"profile": _profile_payload(user)}), 200
    except Exception as exc:  # pragma: no cover
        return handle_error("get_my_profile_ext", exc, rollback=False)


@profile_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    try:
        user = current_user()
        data = request.get_json() or {}
        personal = data.get("personalDetails", {})

        if personal.get("fullName"):
            user.name = personal["fullName"]
        user.email = personal.get("email", user.email)
        user.phone = personal.get("phone", user.phone)
        user.location = personal.get("location", user.location)
        user.linkedin_url = personal.get("linkedin", user.linkedin_url)
        user.github_url = personal.get("github", user.github_url)
        user.website_url = personal.get("website", user.website_url)
        user.summary = data.get("summary", user.summary)

        Experience.query.filter_by(user_id=user.id).delete()
        for exp in data.get("experience", []):
            db.session.add(
                Experience(
                    user_id=user.id,
                    title=exp.get("jobTitle") or exp.get("job_title"),
                    company=exp.get("company"),
                    location=exp.get("location"),
                    description=exp.get("description"),
                    start_date=parse_date(exp.get("startDate")),
                    end_date=parse_date(exp.get("endDate")),
                    current_job=(not exp.get("endDate")) or str(exp.get("endDate")).strip().lower() == "present",
                    employment_type=exp.get("employmentType"),
                )
            )

        Education.query.filter_by(user_id=user.id).delete()
        for edu in data.get("education", []):
            db.session.add(
                Education(
                    user_id=user.id,
                    institution=edu.get("institution"),
                    degree=edu.get("degree"),
                    field=edu.get("field"),
                    location=edu.get("location"),
                    description=edu.get("description"),
                    start_date=parse_date(edu.get("startDate")),
                    end_date=parse_date(edu.get("endDate")),
                )
            )

        for proj in Project.query.filter_by(user_id=user.id).all():
            if project_is_regular(proj):
                db.session.delete(proj)
        for proj in data.get("projects", []):
            db.session.add(
                Project(
                    user_id=user.id,
                    name=proj.get("title"),
                    description=proj.get("description"),
                    demo_url=proj.get("project_url") or proj.get("link"),
                    github_url=proj.get("github_url"),
                    technologies=dump_technologies(proj.get("technologies")),
                    status="project",
                )
            )

        Skill.query.filter_by(user_id=user.id).delete()
        for skill_name in data.get("skills", []):
            if skill_name:
                db.session.add(Skill(user_id=user.id, name=skill_name))

        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "profile": _profile_payload(user)}), 200
    except Exception as exc:  # pragma: no cover
        return handle_error("update_my_profile_ext", exc)
