import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

// Lightweight fetch + map similar to CVEditor (read-only)
const formatLoadDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const dateOnly = String(dateStr).split("T")[0];
    const date = new Date(dateOnly);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (e) {
    return String(dateStr);
  }
};

export default function RecruProfileView({ profileId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (profileId) {
          const res = await fetch(`${API_BASE}/public/profile/${profileId}`);
          if (!res.ok) throw new Error("Failed to load public profile");
          const data = await res.json();
          const mapped = mapPublicData(data);
          if (mounted) setCvData(mapped);
        } else {
          const token = localStorage.getItem("token");
          if (!token) {
            if (mounted) setCvData(null);
          } else {
            const res = await fetch(`${API_BASE}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load your profile");
            const data = await res.json();
            const mapped = mapPrivateData(data);
            if (mounted) setCvData(mapped);
          }
        }
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          <p className="mt-3 text-slate-600">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return null;
  }

  const {
    personalDetails,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
  } = cvData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {personalDetails?.fullName || "Your Name"}
            </h1>
            <div className="mt-1 text-slate-600">
              {[personalDetails?.email, personalDetails?.location]
                .filter(Boolean)
                .join(" • ")}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {personalDetails?.linkedin ? (
                <a
                  className="text-primary-600 hover:underline"
                  href={personalDetails.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
              {personalDetails?.github ? (
                <a
                  className="text-primary-600 hover:underline"
                  href={personalDetails.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
              {personalDetails?.website ? (
                <a
                  className="text-primary-600 hover:underline"
                  href={personalDetails.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              ) : null}
            </div>
          </div>
        </div>
        {summary ? (
          <p className="mt-4 text-slate-700 leading-relaxed">{summary}</p>
        ) : null}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((exp) => (
              <Card key={exp.id}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">
                    {exp.jobTitle || "Job Title"}{" "}
                    {exp.company ? `• ${exp.company}` : ""}
                  </div>
                  <div className="text-sm text-slate-500">
                    {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {[exp.location].filter(Boolean).join(" • ")}
                </div>
                {exp.description && (
                  <p className="mt-2 text-slate-700 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-4">
            {education.map((ed) => (
              <Card key={ed.id}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">
                    {ed.degree || "Degree"}{" "}
                    {ed.institution ? `• ${ed.institution}` : ""}
                  </div>
                  <div className="text-sm text-slate-500">
                    {ed.startDate} {ed.endDate ? `– ${ed.endDate}` : ""}
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {[ed.location].filter(Boolean).join(" • ")}
                </div>
                {ed.description && (
                  <p className="mt-2 text-slate-700 whitespace-pre-line">
                    {ed.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm border border-primary-100"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Card key={p.id}>
                <div className="font-semibold text-slate-900">
                  {p.title || "Project"}
                </div>
                {p.technologies?.length > 0 && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    {p.technologies.slice(0, 5).join(", ")}
                  </div>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary-600 mt-2 inline-block hover:underline"
                  >
                    View project
                  </a>
                )}
                {p.description && (
                  <p className="mt-2 text-slate-700 whitespace-pre-line">
                    {p.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Languages & Certifications */}
      {(languages.length > 0 || certifications.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {languages.length > 0 && (
            <Section title="Languages">
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span
                    key={l.id}
                    className="px-3 py-1 rounded-full bg-gray-50 text-slate-700 text-sm border border-gray-200"
                  >
                    {l.name} {l.proficiency ? `• ${l.proficiency}` : ""}
                  </span>
                ))}
              </div>
            </Section>
          )}
          {certifications.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-3">
                {certifications.map((c) => (
                  <div key={c.id} className="text-sm">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-slate-600">
                      {[c.issuer, formatLoadDate(c.date)]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {children}
    </div>
  );
}

function mapPublicData(data) {
  return {
    personalDetails: {
      fullName: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin_url || "",
      github: data.github_url || "",
      website: data.website_url || "",
    },
    summary: data.summary || "",
    experience: (data.work_experiences || []).map((exp) => ({
      id: exp.experience_id || crypto.randomUUID(),
      jobTitle: exp.job_title || "",
      company: exp.company || "",
      startDate: formatLoadDate(exp.start_date),
      endDate: formatLoadDate(exp.end_date) || "",
      location: exp.location || "",
      description: exp.description || "",
    })),
    education: (data.educations || []).map((edu) => ({
      id: edu.education_id || crypto.randomUUID(),
      degree: edu.degree || "",
      institution: edu.institution || "",
      startDate: formatLoadDate(edu.start_date),
      endDate: formatLoadDate(edu.end_date) || "",
      location: edu.location || "",
      description: edu.description || "",
    })),
    skills: (data.skills || []).map((s) => s.skill_name || s),
    projects: (data.projects || []).map((proj) => ({
      id: proj.project_id || crypto.randomUUID(),
      title: proj.title || "",
      description: proj.description || "",
      link: proj.project_url || proj.link || "",
      technologies: proj.technologies || [],
    })),
    languages: (data.languages || []).map((lang) => ({
      id: lang.language_id || crypto.randomUUID(),
      name: lang.name || "",
      proficiency: lang.proficiency || "",
    })),
    certifications: (data.certifications || []).map((cert) => ({
      id: cert.certification_id || crypto.randomUUID(),
      name: cert.name || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
    })),
  };
}

function mapPrivateData(data) {
  const p = data.profile || {};
  return {
    personalDetails: {
      fullName: p.full_name || "",
      email: p.email || "",
      phone: p.phone || "",
      location: p.location || "",
      linkedin: p.linkedin_url || "",
      github: p.github_url || "",
      website: p.website_url || "",
    },
    summary: p.summary || "",
    experience: (p.work_experiences || []).map((exp) => ({
      id: exp.experience_id || crypto.randomUUID(),
      jobTitle: exp.job_title || "",
      company: exp.company || "",
      startDate: formatLoadDate(exp.start_date),
      endDate: formatLoadDate(exp.end_date) || "",
      location: exp.location || "",
      description: exp.description || "",
    })),
    education: (p.educations || []).map((edu) => ({
      id: edu.education_id || crypto.randomUUID(),
      degree: edu.degree || "",
      institution: edu.institution || "",
      startDate: formatLoadDate(edu.start_date),
      endDate: formatLoadDate(edu.end_date) || "",
      location: edu.location || "",
      description: edu.description || "",
    })),
    skills: (p.skills || []).map((s) => s.skill_name || s),
    projects: (p.projects || []).map((proj) => ({
      id: proj.project_id || crypto.randomUUID(),
      title: proj.title || "",
      description: proj.description || "",
      link: proj.project_url || proj.link || "",
      technologies: proj.technologies || [],
    })),
    languages: (p.languages || []).map((lang) => ({
      id: lang.language_id || crypto.randomUUID(),
      name: lang.name || "",
      proficiency: lang.proficiency || "",
    })),
    certifications: (p.certifications || []).map((cert) => ({
      id: cert.certification_id || crypto.randomUUID(),
      name: cert.name || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
    })),
  };
}
