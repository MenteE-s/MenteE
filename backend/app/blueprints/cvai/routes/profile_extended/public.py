from flask import jsonify

from . import profile_bp
from .utils import (
    ser_experience,
    ser_education,
    ser_project,
    ser_portfolio_item,
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
    project_is_portfolio,
    project_is_regular,
)
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


@profile_bp.route("/public/profile/<int:user_id>", methods=["GET"])
def public_profile(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Profile not found"}), 404

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
    projects_all = (
        Project.query.filter_by(user_id=user.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    skills = (
        Skill.query.filter_by(user_id=user.id)
        .order_by(Skill.created_at.desc())
        .all()
    )
    awards = (
        Award.query.filter_by(user_id=user.id)
        .order_by(Award.date.desc().nullslast())
        .all()
    )
    certs = (
        Certification.query.filter_by(user_id=user.id)
        .order_by(Certification.date_obtained.desc().nullslast())
        .all()
    )
    pubs = (
        Publication.query.filter_by(user_id=user.id)
        .order_by(Publication.year.desc().nullslast())
        .all()
    )
    patents = (
        Patent.query.filter_by(user_id=user.id)
        .order_by(Patent.grant_date.desc().nullslast())
        .all()
    )
    languages = (
        Language.query.filter_by(user_id=user.id)
        .order_by(Language.created_at.desc())
        .all()
    )
    volunteering = (
        VolunteerExperience.query.filter_by(user_id=user.id)
        .order_by(VolunteerExperience.start_date.desc().nullslast())
        .all()
    )
    interests = (
        HobbyInterest.query.filter_by(user_id=user.id)
        .order_by(HobbyInterest.created_at.desc())
        .all()
    )
    socials = (
        SocialMediaLink.query.filter_by(user_id=user.id)
        .order_by(SocialMediaLink.created_at.desc())
        .all()
    )
    courses = (
        CourseTraining.query.filter_by(user_id=user.id)
        .order_by(CourseTraining.completion_date.desc().nullslast())
        .all()
    )
    refs = (
        Reference.query.filter_by(user_id=user.id)
        .order_by(Reference.created_at.desc())
        .all()
    )

    regular_projects = [p for p in projects_all if project_is_regular(p)]
    portfolio_items = [p for p in projects_all if project_is_portfolio(p)]

    payload = {
        "profile_id": user.id,
        "full_name": user.name,
        "email": user.email,
        "phone": user.phone,
        "location": user.location,
        "linkedin_url": user.linkedin_url,
        "github_url": user.github_url,
        "website_url": user.website_url,
        "summary": user.summary,
        "work_experiences": [ser_experience(e) for e in experiences],
        "educations": [ser_education(e) for e in educations],
        "projects": [ser_project(p) for p in regular_projects],
        "portfolio_items": [ser_portfolio_item(p) for p in portfolio_items],
        "skills": [{"skill_name": s.name} for s in skills],
        "awards": [ser_award(a) for a in awards],
        "certifications": [ser_cert(c) for c in certs],
        "publications": [ser_publication(pub) for pub in pubs],
        "patents": [ser_patent(pt) for pt in patents],
        "languages": [ser_language(l) for l in languages],
        "volunteering": [ser_volunteering(v) for v in volunteering],
        "interests": [ser_interest(i) for i in interests],
        "social_profiles": [ser_social(s) for s in socials],
        "courses": [ser_course(c) for c in courses],
        "references": [ser_reference(r) for r in refs],
    }

    return jsonify(payload), 200
