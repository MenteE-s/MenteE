from __future__ import annotations

import json
import traceback
from datetime import date, datetime
from typing import Any, Dict, Iterable, List, Callable

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import BadRequest

from extensions import db
from app.models import (
    Award,
    Certification,
    CourseTraining,
    Education,
    Experience,
    HobbyInterest,
    Language,
    Patent,
    Project,
    Publication,
    Reference,
    Skill,
    SocialMediaLink,
    User,
    VolunteerExperience,
)
from . import profile_bp


def parse_date(date_str: str | None) -> date | None:
    if not date_str or str(date_str).strip().lower() == "present":
        return None
    candidate = str(date_str).split("T")[0].strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%b %Y", "%B %Y", "%m/%Y", "%Y"):
        try:
            return datetime.strptime(candidate, fmt).date()
        except ValueError:
            continue
    return None


def safe_int_year(value: Any) -> int | None:
    if not value:
        return None
    try:
        return int(str(value)[:4])
    except ValueError:
        parsed = parse_date(str(value))
        return parsed.year if parsed else None


def current_user() -> User:
    identity = get_jwt_identity()
    try:
        user_id = int(identity)
    except (TypeError, ValueError):  # pragma: no cover
        raise BadRequest("Invalid user identity in token")
    user = User.query.get(user_id)
    if not user:
        raise BadRequest("User not found")
    return user


def owned_instance(model, item_id: int, user_id: int):
    instance = model.query.get(item_id)
    if not instance or instance.user_id != user_id:
        return None
    return instance


def handle_error(location: str, exc: Exception, rollback: bool = True):
    print(f"DEBUG: Error in {location}: {exc}")
    traceback.print_exc()
    if rollback:
        db.session.rollback()
    return jsonify({"message": f"Error: {exc}"}), 500


def load_technologies(raw_value: str | None) -> List[str]:
    if not raw_value:
        return []
    try:
        return json.loads(raw_value)
    except (TypeError, ValueError):
        return []


def dump_technologies(values: Iterable[str] | None) -> str | None:
    techs = [v for v in (values or []) if v]
    return json.dumps(techs) if techs else None


# Serializers
def ser_experience(exp: Experience) -> Dict[str, Any]:
    return {
        "experience_id": exp.id,
        "job_title": exp.title,
        "company": exp.company,
        "location": exp.location,
        "start_date": exp.start_date.isoformat() if exp.start_date else None,
        "end_date": exp.end_date.isoformat() if exp.end_date else None,
        "description": exp.description,
        "employment_type": exp.employment_type,
        "current": exp.current_job,
    }


def ser_education(edu: Education) -> Dict[str, Any]:
    return {
        "education_id": edu.id,
        "institution": edu.institution,
        "degree": edu.degree,
        "field": edu.field,
        "location": edu.location,
        "start_date": edu.start_date.isoformat() if edu.start_date else None,
        "end_date": edu.end_date.isoformat() if edu.end_date else None,
        "description": edu.description,
    }


def ser_project(proj: Project) -> Dict[str, Any]:
    return {
        "project_id": proj.id,
        "title": proj.name,
        "description": proj.description,
        "project_url": proj.demo_url or proj.github_url,
        "technologies": load_technologies(proj.technologies),
    }


def ser_portfolio_item(proj: Project) -> Dict[str, Any]:
    return {
        "portfolio_item_id": proj.id,
        "title": proj.name,
        "description": proj.description,
        "url": proj.demo_url or proj.github_url,
    }


def ser_skill(skill: Skill) -> Dict[str, Any]:
    return {"skill_id": skill.id, "skill_name": skill.name}


def ser_award(award: Award) -> Dict[str, Any]:
    return {
        "award_id": award.id,
        "title": award.title,
        "issuer": award.issuer,
        "description": award.description,
        "date": award.date.isoformat() if award.date else None,
    }


def ser_cert(cert: Certification) -> Dict[str, Any]:
    return {
        "certification_id": cert.id,
        "name": cert.name,
        "issuer": cert.issuer,
        "date": cert.date_obtained.isoformat() if cert.date_obtained else None,
        "credential_id": cert.credential_id,
        "credential_url": cert.credential_id,
    }


def ser_publication(pub: Publication) -> Dict[str, Any]:
    return {
        "publication_id": pub.id,
        "title": pub.title,
        "description": pub.abstract,
        "publisher": pub.journal,
        "date": str(pub.year) if pub.year else None,
        "url": pub.publication_url,
    }


def ser_patent(patent: Patent) -> Dict[str, Any]:
    status = "granted" if patent.grant_date else ("filed" if patent.filing_date else "pending")
    date_value = patent.grant_date or patent.filing_date
    return {
        "patent_id": patent.id,
        "title": patent.title,
        "description": patent.description,
        "patent_number": patent.patent_number,
        "date": date_value.isoformat() if date_value else None,
        "status": status,
    }


def ser_language(lang: Language) -> Dict[str, Any]:
    return {"language_id": lang.id, "name": lang.name, "proficiency": lang.proficiency_level}


def ser_volunteering(vol: VolunteerExperience) -> Dict[str, Any]:
    return {
        "volunteering_id": vol.id,
        "organization": vol.organization,
        "role": vol.title,
        "start_date": vol.start_date.isoformat() if vol.start_date else None,
        "end_date": vol.end_date.isoformat() if vol.end_date else None,
        "description": vol.description,
    }


def ser_interest(interest: HobbyInterest) -> Dict[str, Any]:
    return {
        "interest_id": interest.id,
        "name": interest.name,
        "description": interest.description,
    }


def ser_social(profile: SocialMediaLink) -> Dict[str, Any]:
    return {"social_profile_id": profile.id, "platform": profile.platform, "url": profile.url}


def ser_course(course: CourseTraining) -> Dict[str, Any]:
    return {
        "course_id": course.id,
        "title": course.name,
        "institution": course.provider,
        "completion_date": course.completion_date.isoformat() if course.completion_date else None,
        "url": course.credential_id,
        "description": course.description,
    }


def ser_reference(ref: Reference) -> Dict[str, Any]:
    return {
        "reference_id": ref.id,
        "name": ref.name,
        "relationship": ref.relationship,
        "contact": ref.company,
        "email": ref.email,
        "phone": ref.phone,
        "notes": ref.title,
    }


def register_crud(
    resource: str,
    model,
    response_key: str,
    serializer: Callable[[Any], Dict[str, Any]],
    builder: Callable[[User, Dict[str, Any]], Any],
    updater: Callable[[Any, Dict[str, Any]], None],
    predicate: Callable[[Any], bool] | None = None,
):
    endpoint = resource.replace("/", "_")

    def create_handler():
        try:
            user = current_user()
            payload = request.get_json() or {}
            if not payload:
                raise BadRequest(f"Missing {resource} data")
            instance = builder(user, payload)
            db.session.add(instance)
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": f"{response_key.replace('_', ' ').title()} added successfully",
                        response_key: serializer(instance),
                    }
                ),
                201,
            )
        except Exception as exc:  # pragma: no cover
            return handle_error(f"add_{endpoint}", exc)

    create_handler.__name__ = f"add_{endpoint}"

    def update_handler(item_id: int):
        try:
            user = current_user()
            instance = owned_instance(model, item_id, user.id)
            if not instance or (predicate and not predicate(instance)):
                return jsonify({"message": f"{response_key.replace('_', ' ').title()} not found"}), 404
            payload = request.get_json() or {}
            if not payload:
                raise BadRequest(f"Missing {resource} data")
            updater(instance, payload)
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": f"{response_key.replace('_', ' ').title()} updated successfully",
                        response_key: serializer(instance),
                    }
                ),
                200,
            )
        except Exception as exc:  # pragma: no cover
            return handle_error(f"update_{endpoint}", exc)

    update_handler.__name__ = f"update_{endpoint}"

    def delete_handler(item_id: int):
        try:
            user = current_user()
            instance = owned_instance(model, item_id, user.id)
            if not instance or (predicate and not predicate(instance)):
                return jsonify({"message": f"{response_key.replace('_', ' ').title()} not found"}), 404
            db.session.delete(instance)
            db.session.commit()
            return jsonify({"message": f"{response_key.replace('_', ' ').title()} deleted successfully"}), 200
        except Exception as exc:  # pragma: no cover
            return handle_error(f"delete_{endpoint}", exc)

    delete_handler.__name__ = f"delete_{endpoint}"

    profile_bp.add_url_rule(f"/me/{resource}", view_func=create_handler, methods=["POST"])
    profile_bp.add_url_rule(f"/me/{resource}/<int:item_id>", view_func=update_handler, methods=["PUT"])
    profile_bp.add_url_rule(f"/me/{resource}/<int:item_id>", view_func=delete_handler, methods=["DELETE"])


# Builder / updater functions
def build_experience(user: User, data: Dict[str, Any]) -> Experience:
    return Experience(
        user_id=user.id,
        title=data.get("jobTitle") or data.get("job_title"),
        company=data.get("company"),
        location=data.get("location"),
        description=data.get("description"),
        start_date=parse_date(data.get("startDate")),
        end_date=parse_date(data.get("endDate")),
        current_job=(not data.get("endDate")) or str(data.get("endDate")).strip().lower() == "present",
        employment_type=data.get("employmentType"),
    )


def update_experience(instance: Experience, data: Dict[str, Any]) -> None:
    if "jobTitle" in data or "job_title" in data:
        instance.title = data.get("jobTitle") or data.get("job_title") or instance.title
    instance.company = data.get("company", instance.company)
    instance.location = data.get("location", instance.location)
    instance.description = data.get("description", instance.description)
    if "startDate" in data:
        instance.start_date = parse_date(data.get("startDate"))
    if "endDate" in data:
        instance.end_date = parse_date(data.get("endDate"))
        instance.current_job = (not data.get("endDate")) or str(data.get("endDate")).strip().lower() == "present"
    if "employmentType" in data:
        instance.employment_type = data.get("employmentType")


def build_education(user: User, data: Dict[str, Any]) -> Education:
    return Education(
        user_id=user.id,
        institution=data.get("institution"),
        degree=data.get("degree"),
        field=data.get("field"),
        location=data.get("location"),
        description=data.get("description"),
        start_date=parse_date(data.get("startDate")),
        end_date=parse_date(data.get("endDate")),
    )


def update_education(instance: Education, data: Dict[str, Any]) -> None:
    instance.institution = data.get("institution", instance.institution)
    instance.degree = data.get("degree", instance.degree)
    instance.field = data.get("field", instance.field)
    instance.location = data.get("location", instance.location)
    instance.description = data.get("description", instance.description)
    if "startDate" in data:
        instance.start_date = parse_date(data.get("startDate"))
    if "endDate" in data:
        instance.end_date = parse_date(data.get("endDate"))


def build_project(user: User, data: Dict[str, Any]) -> Project:
    return Project(
        user_id=user.id,
        name=data.get("title"),
        description=data.get("description"),
        demo_url=data.get("project_url") or data.get("link"),
        github_url=data.get("github_url"),
        technologies=dump_technologies(data.get("technologies")),
        status="project",
    )


def update_project(instance: Project, data: Dict[str, Any]) -> None:
    instance.name = data.get("title", instance.name)
    instance.description = data.get("description", instance.description)
    if "project_url" in data or "link" in data or "github_url" in data:
        instance.demo_url = data.get("project_url") or data.get("link") or instance.demo_url
        instance.github_url = data.get("github_url", instance.github_url)
    if "technologies" in data:
        instance.technologies = dump_technologies(data.get("technologies"))


def build_portfolio_item(user: User, data: Dict[str, Any]) -> Project:
    return Project(
        user_id=user.id,
        name=data.get("title"),
        description=data.get("description"),
        demo_url=data.get("url"),
        status="portfolio",
    )


def update_portfolio_item(instance: Project, data: Dict[str, Any]) -> None:
    instance.name = data.get("title", instance.name)
    instance.description = data.get("description", instance.description)
    if "url" in data:
        instance.demo_url = data.get("url")


def build_award(user: User, data: Dict[str, Any]) -> Award:
    return Award(
        user_id=user.id,
        title=data.get("title"),
        issuer=data.get("issuer") or data.get("organization") or "Self",
        description=data.get("description"),
        date=parse_date(data.get("date")),
    )


def update_award(instance: Award, data: Dict[str, Any]) -> None:
    instance.title = data.get("title", instance.title)
    instance.issuer = data.get("issuer", instance.issuer)
    instance.description = data.get("description", instance.description)
    if "date" in data:
        instance.date = parse_date(data.get("date"))


def build_certification(user: User, data: Dict[str, Any]) -> Certification:
    return Certification(
        user_id=user.id,
        name=data.get("name") or data.get("title"),
        issuer=data.get("issuer") or "Issuer",
        date_obtained=parse_date(data.get("date")),
        credential_id=data.get("credential_id") or data.get("credential_url"),
    )


def update_certification(instance: Certification, data: Dict[str, Any]) -> None:
    instance.name = data.get("name", data.get("title", instance.name))
    instance.issuer = data.get("issuer", instance.issuer)
    if "date" in data:
        instance.date_obtained = parse_date(data.get("date"))
    if "credential_id" in data or "credential_url" in data:
        instance.credential_id = data.get("credential_id") or data.get("credential_url")


def build_publication(user: User, data: Dict[str, Any]) -> Publication:
    return Publication(
        user_id=user.id,
        title=data.get("title"),
        abstract=data.get("description"),
        journal=data.get("publisher"),
        publication_url=data.get("url"),
        year=safe_int_year(data.get("date")),
        authors=json.dumps(data.get("authors", [])) if data.get("authors") else None,
    )


def update_publication(instance: Publication, data: Dict[str, Any]) -> None:
    instance.title = data.get("title", instance.title)
    instance.abstract = data.get("description", instance.abstract)
    instance.journal = data.get("publisher", instance.journal)
    instance.publication_url = data.get("url", instance.publication_url)
    if "date" in data:
        instance.year = safe_int_year(data.get("date"))


def build_patent(user: User, data: Dict[str, Any]) -> Patent:
    return Patent(
        user_id=user.id,
        title=data.get("title"),
        description=data.get("description"),
        patent_number=data.get("patent_number"),
        filing_date=parse_date(data.get("filing_date")) or parse_date(data.get("date")),
    )


def update_patent(instance: Patent, data: Dict[str, Any]) -> None:
    instance.title = data.get("title", instance.title)
    instance.description = data.get("description", instance.description)
    instance.patent_number = data.get("patent_number", instance.patent_number)
    if "date" in data:
        instance.grant_date = parse_date(data.get("date"))


def build_language(user: User, data: Dict[str, Any]) -> Language:
    return Language(user_id=user.id, name=data.get("name"), proficiency_level=data.get("proficiency"))


def update_language(instance: Language, data: Dict[str, Any]) -> None:
    instance.name = data.get("name", instance.name)
    instance.proficiency_level = data.get("proficiency", instance.proficiency_level)


def build_volunteering(user: User, data: Dict[str, Any]) -> VolunteerExperience:
    return VolunteerExperience(
        user_id=user.id,
        organization=data.get("organization"),
        title=data.get("role"),
        description=data.get("description"),
        start_date=parse_date(data.get("start_date")),
        end_date=parse_date(data.get("end_date")),
    )


def update_volunteering(instance: VolunteerExperience, data: Dict[str, Any]) -> None:
    instance.organization = data.get("organization", instance.organization)
    instance.title = data.get("role", instance.title)
    instance.description = data.get("description", instance.description)
    if "start_date" in data:
        instance.start_date = parse_date(data.get("start_date"))
    if "end_date" in data:
        instance.end_date = parse_date(data.get("end_date"))


def build_interest(user: User, data: Dict[str, Any]) -> HobbyInterest:
    return HobbyInterest(user_id=user.id, name=data.get("name"), description=data.get("description"))


def update_interest(instance: HobbyInterest, data: Dict[str, Any]) -> None:
    instance.name = data.get("name", instance.name)
    instance.description = data.get("description", instance.description)


def build_social(user: User, data: Dict[str, Any]) -> SocialMediaLink:
    return SocialMediaLink(user_id=user.id, platform=data.get("platform"), url=data.get("url"))


def update_social(instance: SocialMediaLink, data: Dict[str, Any]) -> None:
    instance.platform = data.get("platform", instance.platform)
    instance.url = data.get("url", instance.url)


def build_course(user: User, data: Dict[str, Any]) -> CourseTraining:
    return CourseTraining(
        user_id=user.id,
        name=data.get("title"),
        provider=data.get("institution"),
        completion_date=parse_date(data.get("completion_date")),
        credential_id=data.get("url"),
        description=data.get("description"),
    )


def update_course(instance: CourseTraining, data: Dict[str, Any]) -> None:
    instance.name = data.get("title", instance.name)
    instance.provider = data.get("institution", instance.provider)
    if "completion_date" in data:
        instance.completion_date = parse_date(data.get("completion_date"))
    if "url" in data:
        instance.credential_id = data.get("url")
    instance.description = data.get("description", instance.description)


def build_reference(user: User, data: Dict[str, Any]) -> Reference:
    return Reference(
        user_id=user.id,
        name=data.get("name"),
        relationship=data.get("relationship"),
        company=data.get("contact"),
        email=data.get("email"),
        phone=data.get("phone"),
        title=data.get("notes"),
    )


def update_reference(instance: Reference, data: Dict[str, Any]) -> None:
    instance.name = data.get("name", instance.name)
    instance.relationship = data.get("relationship", instance.relationship)
    instance.company = data.get("contact", instance.company)
    instance.email = data.get("email", instance.email)
    instance.phone = data.get("phone", instance.phone)
    instance.title = data.get("notes", instance.title)


def project_is_portfolio(project: Project) -> bool:
    return (project.status or "").lower() == "portfolio"


def project_is_regular(project: Project) -> bool:
    return not project_is_portfolio(project)
