import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, X, ExternalLink, Download, Save } from "lucide-react";
import { showSuccess, showError } from "../../utils/toast";
import { API_BASE } from "../../config";

// Continuous editor — no step tracking required (sections render in a stacked layout)

const initialCvData = {
  personalDetails: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  accomplishments: [],
  portfolio: [],
  publications: [],
  patents: [],
  languages: [],
  certifications: [],
  volunteering: [],
  interests: [],
  social_media: [],
  courses: [],
  references: [],
};

// Helper to normalize dates
const formatLoadDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const dateOnly = dateStr.split("T")[0];
    const date = new Date(dateOnly);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (e) {
    return dateStr;
  }
};

const CVEditorComponent = ({
  profileIdProp,
  readOnly: readOnlyProp = false,
}) => {
  // no currentStep state necessary in continuous layout
  const [cvData, setCvData] = useState(initialCvData);
  const params = useParams();
  const profileIdFromUrl = params ? params.profileId : null;
  const profileId = profileIdProp || profileIdFromUrl;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const autoSaveIntervalRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    accomplishments: true,
    portfolio: true,
    publications: true,
    patents: true,
    languages: true,
    certifications: true,
    volunteering: true,
    interests: true,
    social: true,
  });
  const readOnly = readOnlyProp || false;

  // Handle data changes and mark as unsaved
  const handleDataChange = (newData) => {
    setCvData(newData);
    setHasUnsavedChanges(true);
  };

  // Fetch profile data
  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (profileId) {
          // Public profile view
          const res = await fetch(`${API_BASE}/public/profile/${profileId}`);
          if (!res.ok) throw new Error("Failed to fetch profile");
          const data = await res.json();

          const formattedData = {
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
              isPersisted: true,
              jobTitle: exp.job_title || "",
              company: exp.company || "",
              startDate: formatLoadDate(exp.start_date),
              endDate: formatLoadDate(exp.end_date) || "",
              location: exp.location || "",
              description: exp.description || "",
            })),
            education: (data.educations || []).map((edu) => ({
              id: edu.education_id || crypto.randomUUID(),
              isPersisted: true,
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
              isPersisted: true,
              title: proj.title || "",
              description: proj.description || "",
              link: proj.project_url || proj.link || "",
              technologies: proj.technologies || [],
            })),
            accomplishments: (data.awards || []).map((acc) => ({
              id: acc.award_id || crypto.randomUUID(),
              isPersisted: true,
              title: acc.title || "",
              description: acc.description || "",
              date: acc.date || "",
              type: "award",
            })),
            portfolio: (data.portfolio_items || []).map((item) => ({
              id: item.portfolio_item_id || crypto.randomUUID(),
              isPersisted: true,
              title: item.title || "",
              description: item.description || "",
              url: item.url || "",
              type: "project",
            })),
            publications: (data.publications || []).map((pub) => ({
              id: pub.publication_id || crypto.randomUUID(),
              isPersisted: true,
              title: pub.title || "",
              description: pub.description || "",
              url: pub.url || "",
              publisher: pub.publisher || "",
              date: pub.date || "",
              type: pub.type || "journal",
            })),
            patents: (data.patents || []).map((patent) => ({
              id: patent.patent_id || crypto.randomUUID(),
              isPersisted: true,
              title: patent.title || "",
              description: patent.description || "",
              patent_number: patent.patent_number || "",
              date: patent.date || "",
              status: patent.status || "pending",
            })),
            languages: (data.languages || []).map((lang) => ({
              id: lang.language_id || crypto.randomUUID(),
              isPersisted: true,
              name: lang.name || "",
              proficiency: lang.proficiency || "intermediate",
            })),
            certifications: (data.certifications || []).map((cert) => ({
              id: cert.certification_id || crypto.randomUUID(),
              isPersisted: true,
              name: cert.name || "",
              issuer: cert.issuer || "",
              date: cert.date || "",
              credential_id: cert.credential_id || "",
              credential_url: cert.credential_url || "",
            })),
            volunteering: (data.volunteering || []).map((vol) => ({
              id: vol.volunteering_id || crypto.randomUUID(),
              isPersisted: true,
              organization: vol.organization || "",
              role: vol.role || "",
              start_date: vol.start_date || "",
              end_date: vol.end_date || "",
              description: vol.description || "",
            })),
            interests: (data.interests || [])
              .map((i) => (typeof i === "string" ? i : i.name))
              .filter(Boolean),
            courses: (data.courses || []).map((c) => ({
              id: c.course_id || crypto.randomUUID(),
              isPersisted: true,
              title: c.title || "",
              institution: c.institution || "",
              completion_date: c.completion_date || "",
              url: c.url || "",
              description: c.description || "",
            })),
            references: (data.references || []).map((r) => ({
              id: r.reference_id || crypto.randomUUID(),
              isPersisted: true,
              name: r.name || "",
              relationship: r.relationship || "",
              contact: r.contact || "",
              email: r.email || "",
              phone: r.phone || "",
              notes: r.notes || "",
            })),
            social_media: (data.social_profiles || []).map((social) => ({
              id: social.social_profile_id || crypto.randomUUID(),
              isPersisted: true,
              platform: social.platform || "",
              url: social.url || "",
            })),
          };

          if (mounted) {
            setCvData(formattedData);
            setInitialData(formattedData);
            setHasUnsavedChanges(false);
          }
        } else {
          // Try to load /api/me for the logged-in user
          const token = localStorage.getItem("token");
          if (token) {
            const res = await fetch(`${API_BASE}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch your profile");
            const data = await res.json();

            // If no profile exists yet, use initial data
            if (!data.profile) {
              if (mounted) {
                setCvData(initialCvData);
                setInitialData(initialCvData);
                setHasUnsavedChanges(false);
              }
              return;
            }

            const formattedData = {
              personalDetails: {
                fullName: data.profile.full_name || "",
                email: data.profile.email || "",
                phone: data.profile.phone || "",
                location: data.profile.location || "",
                linkedin: data.profile.linkedin_url || "",
                github: data.profile.github_url || "",
                website: data.profile.website_url || "",
              },
              summary: data.profile.summary || "",
              experience: (data.profile?.work_experiences || []).map((exp) => ({
                id: exp.experience_id || crypto.randomUUID(),
                isPersisted: true,
                jobTitle: exp.job_title || "",
                company: exp.company || "",
                startDate: formatLoadDate(exp.start_date),
                endDate: formatLoadDate(exp.end_date) || "",
                location: exp.location || "",
                description: exp.description || "",
              })),
              education: (data.profile?.educations || []).map((edu) => ({
                id: edu.education_id || crypto.randomUUID(),
                isPersisted: true,
                degree: edu.degree || "",
                institution: edu.institution || "",
                startDate: formatLoadDate(edu.start_date),
                endDate: formatLoadDate(edu.end_date) || "",
                location: edu.location || "",
                description: edu.description || "",
              })),
              skills: (data.profile?.skills || []).map(
                (s) => s.skill_name || s
              ),
              projects: (data.profile?.projects || []).map((proj) => ({
                id: proj.project_id || crypto.randomUUID(),
                isPersisted: true,
                title: proj.title || "",
                description: proj.description || "",
                link: proj.project_url || proj.link || "",
                technologies: proj.technologies || [],
              })),
              accomplishments: (data.profile?.awards || []).map((acc) => ({
                id: acc.award_id || crypto.randomUUID(),
                isPersisted: true,
                title: acc.title || "",
                description: acc.description || "",
                date: acc.date || "",
                type: "award",
              })),
              portfolio: (data.profile?.portfolio_items || []).map((item) => ({
                id: item.portfolio_item_id || crypto.randomUUID(),
                isPersisted: true,
                title: item.title || "",
                description: item.description || "",
                url: item.url || "",
                type: "project",
              })),
              publications: (data.profile?.publications || []).map((pub) => ({
                id: pub.publication_id || crypto.randomUUID(),
                isPersisted: true,
                title: pub.title || "",
                description: pub.description || "",
                url: pub.url || "",
                publisher: pub.publisher || "",
                date: pub.date || "",
                type: pub.type || "journal",
              })),
              patents: (data.profile?.patents || []).map((patent) => ({
                id: patent.patent_id || crypto.randomUUID(),
                isPersisted: true,
                title: patent.title || "",
                description: patent.description || "",
                patent_number: patent.patent_number || "",
                date: patent.date || "",
                status: patent.status || "pending",
              })),
              languages: (data.profile?.languages || []).map((lang) => ({
                id: lang.language_id || crypto.randomUUID(),
                isPersisted: true,
                name: lang.name || "",
                proficiency: lang.proficiency || "intermediate",
              })),
              certifications: (data.profile?.certifications || []).map(
                (cert) => ({
                  id: cert.certification_id || crypto.randomUUID(),
                  isPersisted: true,
                  name: cert.name || "",
                  issuer: cert.issuer || "",
                  date: cert.date || "",
                  credential_id: cert.credential_id || "",
                  credential_url: cert.credential_url || "",
                })
              ),
              volunteering: (data.profile?.volunteering || []).map((vol) => ({
                id: vol.volunteering_id || crypto.randomUUID(),
                isPersisted: true,
                organization: vol.organization || "",
                role: vol.role || "",
                start_date: vol.start_date || "",
                end_date: vol.end_date || "",
                description: vol.description || "",
              })),
              interests: (data.profile?.interests || [])
                .map((i) => (typeof i === "string" ? i : i.name))
                .filter(Boolean),
              courses: (data.profile?.courses || []).map((c) => ({
                id: c.course_id || crypto.randomUUID(),
                isPersisted: true,
                title: c.title || "",
                institution: c.institution || "",
                completion_date: c.completion_date || "",
                url: c.url || "",
                description: c.description || "",
              })),
              references: (data.profile?.references || []).map((r) => ({
                id: r.reference_id || crypto.randomUUID(),
                isPersisted: true,
                name: r.name || "",
                relationship: r.relationship || "",
                contact: r.contact || "",
                email: r.email || "",
                phone: r.phone || "",
                notes: r.notes || "",
              })),
              social_media: (data.profile?.social_profiles || []).map(
                (social) => ({
                  id: social.social_profile_id || crypto.randomUUID(),
                  isPersisted: true,
                  platform: social.platform || "",
                  url: social.url || "",
                })
              ),
            };

            if (mounted) {
              setCvData(formattedData);
              setInitialData(formattedData);
              setCurrentProfileId(data.profile.profile_id);
              setHasUnsavedChanges(false);
            }
          } else {
            // Not logged in and no profileId -> start with defaults
            if (mounted) {
              setCvData(initialCvData);
              setInitialData(initialCvData);
              setHasUnsavedChanges(false);
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [profileId]);

  // Detect changes from initial data
  useEffect(() => {
    if (initialData) {
      const hasChanged = JSON.stringify(cvData) !== JSON.stringify(initialData);
      setHasUnsavedChanges(hasChanged);
    }
  }, [cvData, initialData]);

  // Auto-save effect
  useEffect(() => {
    if (!readOnly && hasUnsavedChanges) {
      autoSaveIntervalRef.current = setInterval(async () => {
        if (hasUnsavedChanges && !isSaving) {
          try {
            await persistProfile(cvData);
            setHasUnsavedChanges(false);
            showSuccess("Profile auto-saved successfully!");
          } catch (err) {
            // Error is already handled in persistProfile
          }
        }
      }, 30000); // 30 seconds
    } else {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [hasUnsavedChanges, isSaving, readOnly, cvData]);

  // Navigation helper removed — continuous layout uses simple anchors/scrolling via UI

  // Continuous layout — no prev/next navigation. Use sidebar to scroll to sections.

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async () => {
    try {
      await persistProfile(cvData);
      setInitialData(JSON.parse(JSON.stringify(cvData))); // Deep copy for initial data
      // keep the user in place (no forced navigation) — if this was a new profile, the app flow can navigate elsewhere
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  // Persist the full profile to /api/me
  const persistProfile = async (stateToPersist) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) return; // only persist when logged in

      const payload = {
        personalDetails: stateToPersist.personalDetails,
        summary: stateToPersist.summary,
        experience: (stateToPersist.experience || []).map((e) => ({
          experience_id: e.isPersisted ? e.id : undefined,
          jobTitle: e.jobTitle,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate,
          location: e.location,
          description: e.description,
        })),
        education: (stateToPersist.education || []).map((ed) => ({
          education_id: ed.isPersisted ? ed.id : undefined,
          degree: ed.degree,
          institution: ed.institution,
          startDate: ed.startDate,
          endDate: ed.endDate,
          location: ed.location,
          description: ed.description,
        })),
        projects: (stateToPersist.projects || []).map((p) => ({
          project_id: p.isPersisted ? p.id : undefined,
          title: p.title,
          description: p.description,
          project_url: p.link,
          technologies: p.technologies || [],
        })),
        accomplishments: (stateToPersist.accomplishments || []).map((a) => ({
          accomplishment_id: a.isPersisted ? a.id : undefined,
          title: a.title,
          description: a.description,
          date: a.date,
          type: a.type,
        })),
        portfolio: (stateToPersist.portfolio || []).map((item) => ({
          portfolio_id: item.isPersisted ? item.id : undefined,
          title: item.title,
          description: item.description,
          url: item.url,
          type: item.type,
        })),
        publications: (stateToPersist.publications || []).map((pub) => ({
          publication_id: pub.isPersisted ? pub.id : undefined,
          title: pub.title,
          description: pub.description,
          url: pub.url,
          publisher: pub.publisher,
          date: pub.date,
          type: pub.type,
        })),
        patents: (stateToPersist.patents || []).map((patent) => ({
          patent_id: patent.isPersisted ? patent.id : undefined,
          title: patent.title,
          description: patent.description,
          patent_number: patent.patent_number,
          date: patent.date,
          status: patent.status,
        })),
        languages: (stateToPersist.languages || []).map((lang) => ({
          language_id: lang.isPersisted ? lang.id : undefined,
          name: lang.name,
          proficiency: lang.proficiency,
        })),
        certifications: (stateToPersist.certifications || []).map((cert) => ({
          certification_id: cert.isPersisted ? cert.id : undefined,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          credential_id: cert.credential_id,
          credential_url: cert.credential_url,
        })),
        volunteering: (stateToPersist.volunteering || []).map((vol) => ({
          volunteering_id: vol.isPersisted ? vol.id : undefined,
          organization: vol.organization,
          role: vol.role,
          start_date: vol.start_date,
          end_date: vol.end_date,
          description: vol.description,
        })),
        interests: stateToPersist.interests || [],
        courses: (stateToPersist.courses || []).map((c) => ({
          course_id: c.isPersisted ? c.id : undefined,
          title: c.title,
          institution: c.institution,
          completion_date: c.completion_date,
          url: c.url,
          description: c.description,
        })),
        references: (stateToPersist.references || []).map((r) => ({
          reference_id: r.isPersisted ? r.id : undefined,
          name: r.name,
          relationship: r.relationship,
          contact: r.contact,
          email: r.email,
          phone: r.phone,
          notes: r.notes,
        })),
        social_media: (stateToPersist.social_media || []).map((social) => ({
          social_id: social.isPersisted ? social.id : undefined,
          platform: social.platform,
          url: social.url,
        })),
        skills: stateToPersist.skills || [],
      };

      let res;
      if (currentProfileId) {
        // Update existing profile
        res = await fetch(`${API_BASE}/profile/${currentProfileId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new profile
        res = await fetch(`${API_BASE}/resumes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to persist profile");
      }

      // Set the profile ID from response if available
      const data = await res.json();
      if (data.profile_id && !currentProfileId) {
        setCurrentProfileId(data.profile_id);
      }

      setHasUnsavedChanges(false);
      showSuccess("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to persist profile:", err);
      showError(err.message || "Failed to save profile");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper: render a simple read-only experience list (resume-style)
  const renderReadOnlyExperience = () => {
    if (!cvData.experience || cvData.experience.length === 0) return null;

    return (
      <div className="space-y-6">
        {cvData.experience.map((exp) => (
          <div
            key={exp.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {exp.company || "Company"}
                {exp.location ? `: ${exp.location}` : ""}
              </div>
              <div className="text-xs">
                {exp.startDate} {exp.endDate ? `to ${exp.endDate}` : ""}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              <h4 className="text-lg font-semibold text-slate-900">
                {exp.jobTitle || "Job Title"}
              </h4>
              <p className="text-slate-600 text-sm mt-1">
                {exp.description || "Employment"}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <button
                  type="button"
                  className="text-primary-600 hover:underline"
                >
                  Show more detail
                </button>
                <div className="text-right">
                  <div className="text-xs">Source:</div>
                  <div className="font-medium">
                    {cvData.personalDetails?.fullName || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Read-only renderers for other sections (resume-style)
  const renderReadOnlyEducation = () => {
    if (!cvData.education || cvData.education.length === 0) return null;

    return (
      <div className="space-y-6">
        {cvData.education.map((edu) => (
          <div
            key={edu.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {edu.institution || "Institution"}
                {edu.location ? ` • ${edu.location}` : ""}
              </div>
              <div className="text-xs">
                {edu.startDate} {edu.endDate ? `to ${edu.endDate}` : ""}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              <h4 className="text-lg font-semibold text-slate-900">
                {edu.degree || "Degree"}
              </h4>
              {edu.description && (
                <p className="text-slate-600 text-sm mt-1">{edu.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyProjects = () => {
    if (!cvData.projects || cvData.projects.length === 0) return null;
    return (
      <div className="space-y-6">
        {cvData.projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {project.title || "Project"}
              </div>
              <div className="text-xs">
                {project.technologies?.slice(0, 3).join(", ")}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm"
                >
                  View Project
                </a>
              ) : null}
              {project.description && (
                <p className="text-slate-600 text-sm mt-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyAccomplishments = () => {
    if (!cvData.accomplishments || cvData.accomplishments.length === 0)
      return null;
    return (
      <div className="space-y-6">
        {cvData.accomplishments.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {item.title || "Accomplishment"}
              </div>
              <div className="text-xs">{item.date}</div>
            </div>
            <div className="px-5 py-4 bg-white">
              {item.description && (
                <p className="text-slate-600 text-sm mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyPortfolio = () => {
    if (!cvData.portfolio || cvData.portfolio.length === 0) return null;
    return (
      <div className="space-y-6">
        {cvData.portfolio.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {item.title || "Portfolio"}
              </div>
              <div className="text-xs">{item.type}</div>
            </div>
            <div className="px-5 py-4 bg-white">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Visit
                </a>
              ) : null}
              {item.description && (
                <p className="text-slate-600 text-sm mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyPublications = () => {
    if (!cvData.publications || cvData.publications.length === 0) return null;
    return (
      <div className="space-y-6">
        {cvData.publications.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {p.title || "Publication"}
              </div>
              <div className="text-xs">
                {p.publisher} • {p.date}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Read
                </a>
              ) : null}
              {p.description && (
                <p className="text-slate-600 text-sm mt-2">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyPatents = () => {
    if (!cvData.patents || cvData.patents.length === 0) return null;
    return (
      <div className="space-y-6">
        {cvData.patents.map((pat) => (
          <div
            key={pat.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {pat.title || "Patent"}
              </div>
              <div className="text-xs">
                {pat.patent_number} • {pat.date}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              {pat.description && (
                <p className="text-slate-600 text-sm mt-1">{pat.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyVolunteering = () => {
    if (!cvData.volunteering || cvData.volunteering.length === 0) return null;
    return (
      <div className="space-y-6">
        {cvData.volunteering.map((v) => (
          <div
            key={v.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {v.role || "Volunteer"} • {v.organization}
              </div>
              <div className="text-xs">
                {v.start_date} {v.end_date ? `to ${v.end_date}` : ""}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              {v.description && (
                <p className="text-slate-600 text-sm mt-1">{v.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyCertifications = () => {
    if (!cvData.certifications || cvData.certifications.length === 0)
      return null;
    return (
      <div className="space-y-6">
        {cvData.certifications.map((c) => (
          <div
            key={c.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-primary-600 text-white">
              <div className="text-sm font-semibold">
                {c.name || "Certification"}
              </div>
              <div className="text-xs">
                {c.issuer} • {c.date}
              </div>
            </div>
            <div className="px-5 py-4 bg-white">
              {c.credential_url ? (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Verify
                </a>
              ) : null}
              {c.description && (
                <p className="text-slate-600 text-sm mt-2">{c.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyLanguages = () => {
    if (!cvData.languages || cvData.languages.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {cvData.languages.map((lang) => (
          <div
            key={lang.id}
            className="px-3 py-1 bg-primary-50 text-primary-700 font-semibold rounded-full text-sm"
          >
            {lang.name} • {lang.proficiency}
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlyInterests = () => {
    if (!cvData.interests || cvData.interests.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {cvData.interests.map((interest, idx) => (
          <div
            key={idx}
            className="px-3 py-1 bg-primary-50 text-primary-700 font-medium rounded-full text-sm"
          >
            {interest}
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlySocial = () => {
    if (!cvData.social_media || cvData.social_media.length === 0) return null;
    return (
      <div className="space-y-4">
        {cvData.social_media.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="font-semibold text-slate-900">{s.platform}</div>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline text-sm"
            >
              Open
            </a>
          </div>
        ))}
      </div>
    );
  };

  const renderReadOnlySkills = () => {
    if (!cvData.skills || cvData.skills.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {cvData.skills.map((s, idx) => (
          <div
            key={idx}
            className="px-3 py-1 bg-primary-50 text-primary-700 font-semibold rounded-full text-sm"
          >
            {s}
          </div>
        ))}
      </div>
    );
  };

  // Loading and Error States
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-8">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CV Editor</h1>
              {hasUnsavedChanges && (
                <p className="text-sm text-orange-600 mt-1">
                  You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSaving || readOnly}
                className="px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition disabled:bg-green-400 flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (!cvData) return;
                  const jsonString = JSON.stringify(cvData, null, 2);
                  const blob = new Blob([jsonString], {
                    type: "application/json",
                  });
                  const href = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = href;
                  const fileName = `${
                    cvData.personalDetails.fullName || "Profile"
                  }.json`.replace(/\s+/g, "_");
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(href);
                }}
                className="px-4 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Continuous editor — all sections are stacked below */}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Personal Details Section */}
          <section id="section-personal">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Personal Details
              </h3>
              <button
                onClick={() => toggleSection("personal")}
                className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
              >
                {expandedSections.personal ? "▼" : "▶"}
              </button>
            </div>
            {expandedSections.personal && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={cvData.personalDetails.fullName || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          fullName: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="John Doe"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={cvData.personalDetails.email || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          email: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="john.doe@example.com"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={cvData.personalDetails.phone || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          phone: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={cvData.personalDetails.location || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          location: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="San Francisco, CA"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={cvData.personalDetails.linkedin || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          linkedin: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://linkedin.com/in/johndoe"
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={cvData.personalDetails.github || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          github: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://github.com/johndoe"
                    disabled={readOnly}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={cvData.personalDetails.website || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          website: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://johndoe.com"
                    disabled={readOnly}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Courses Section */}
          <section id="section-courses">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Courses</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newCourse = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        institution: "",
                        completion_date: "",
                        url: "",
                        description: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        courses: [...(prev.courses || []), newCourse],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Course
                  </button>
                )}
                <button
                  onClick={() => toggleSection("courses")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.courses ? "▼" : "▶"}
                </button>
              </div>
            </div>

            {expandedSections.courses && (
              <div className="space-y-6">
                {cvData.courses && cvData.courses.length > 0 ? (
                  cvData.courses.map((course, idx) => (
                    <div
                      key={course.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {course.title || "Untitled Course"}
                          </h4>
                          <p className="text-slate-600 text-sm">
                            {course.institution}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!readOnly && (
                            <button
                              onClick={() => {
                                const next = cvData.courses.filter(
                                  (_, i) => i !== idx
                                );
                                setCvData((prev) => ({
                                  ...prev,
                                  courses: next,
                                }));
                              }}
                              className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Course Title
                          </label>
                          <input
                            type="text"
                            value={course.title}
                            onChange={(e) => {
                              const updated = [...cvData.courses];
                              updated[idx] = {
                                ...updated[idx],
                                title: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                courses: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={course.institution}
                            onChange={(e) => {
                              const updated = [...cvData.courses];
                              updated[idx] = {
                                ...updated[idx],
                                institution: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                courses: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Completion Date
                          </label>
                          <input
                            type="date"
                            value={course.completion_date}
                            onChange={(e) => {
                              const updated = [...cvData.courses];
                              updated[idx] = {
                                ...updated[idx],
                                completion_date: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                courses: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            URL
                          </label>
                          <input
                            type="url"
                            value={course.url}
                            onChange={(e) => {
                              const updated = [...cvData.courses];
                              updated[idx] = {
                                ...updated[idx],
                                url: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                courses: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description / Notes
                        </label>
                        <textarea
                          rows={3}
                          value={course.description}
                          onChange={(e) => {
                            const updated = [...cvData.courses];
                            updated[idx] = {
                              ...updated[idx],
                              description: e.target.value,
                            };
                            setCvData((prev) => ({
                              ...prev,
                              courses: updated,
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No courses added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* References Section */}
          <section id="section-references">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">References</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newRef = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        name: "",
                        relationship: "",
                        contact: "",
                        email: "",
                        phone: "",
                        notes: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        references: [...(prev.references || []), newRef],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Reference
                  </button>
                )}
                <button
                  onClick={() => toggleSection("references")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.references ? "▼" : "▶"}
                </button>
              </div>
            </div>

            {expandedSections.references && (
              <div className="space-y-6">
                {cvData.references && cvData.references.length > 0 ? (
                  cvData.references.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {ref.name || "Reference"}
                          </h4>
                          <p className="text-slate-600 text-sm">
                            {ref.relationship}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!readOnly && (
                            <button
                              onClick={() => {
                                const next = cvData.references.filter(
                                  (_, i) => i !== idx
                                );
                                setCvData((prev) => ({
                                  ...prev,
                                  references: next,
                                }));
                              }}
                              className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={ref.name}
                            onChange={(e) => {
                              const updated = [...cvData.references];
                              updated[idx] = {
                                ...updated[idx],
                                name: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                references: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Relationship
                          </label>
                          <input
                            type="text"
                            value={ref.relationship}
                            onChange={(e) => {
                              const updated = [...cvData.references];
                              updated[idx] = {
                                ...updated[idx],
                                relationship: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                references: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={ref.email}
                            onChange={(e) => {
                              const updated = [...cvData.references];
                              updated[idx] = {
                                ...updated[idx],
                                email: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                references: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={ref.phone}
                            onChange={(e) => {
                              const updated = [...cvData.references];
                              updated[idx] = {
                                ...updated[idx],
                                phone: e.target.value,
                              };
                              setCvData((prev) => ({
                                ...prev,
                                references: updated,
                              }));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={readOnly}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          rows={3}
                          value={ref.notes}
                          onChange={(e) => {
                            const updated = [...cvData.references];
                            updated[idx] = {
                              ...updated[idx],
                              notes: e.target.value,
                            };
                            setCvData((prev) => ({
                              ...prev,
                              references: updated,
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No references added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Professional Summary Section */}
          <section id="section-summary">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Professional Summary
              </h3>
              <button
                onClick={() => toggleSection("summary")}
                className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
              >
                {expandedSections.summary ? "▼" : "▶"}
              </button>
            </div>
            {expandedSections.summary && (
              <div>
                <textarea
                  rows="5"
                  value={cvData.summary || ""}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief summary of your professional background"
                  disabled={readOnly}
                />
              </div>
            )}
          </section>

          {/* Work Experience Section */}
          <section id="section-experience">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Work Experience
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newExp = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        jobTitle: "",
                        company: "",
                        startDate: "",
                        endDate: "",
                        location: "",
                        description: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        experience: [...(prev.experience || []), newExp],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Experience
                  </button>
                )}
                <button
                  onClick={() => toggleSection("experience")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.experience ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.experience && (
              <div className="space-y-6">
                {cvData.experience && cvData.experience.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyExperience()
                  ) : (
                    <div className="space-y-6">
                      {cvData.experience.map((exp, idx) => (
                        <div
                          key={exp.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {exp.jobTitle}
                              </h4>
                              <p className="text-slate-600">{exp.company}</p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedExperiences =
                                      cvData.experience.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      experience: updatedExperiences,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Job Title
                              </label>
                              <input
                                type="text"
                                value={exp.jobTitle}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    jobTitle: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Software Engineer"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    company: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Google"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    startDate: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Jan 2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    endDate: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Present"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    location: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="San Francisco, CA"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={exp.description}
                                onChange={(e) => {
                                  const updatedExperiences = [
                                    ...cvData.experience,
                                  ];
                                  updatedExperiences[idx] = {
                                    ...exp,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    experience: updatedExperiences,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe your responsibilities and achievements"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No work experience added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Education Section */}
          <section id="section-education">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Education</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newEdu = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        degree: "",
                        institution: "",
                        startDate: "",
                        endDate: "",
                        location: "",
                        description: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        education: [...(prev.education || []), newEdu],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Education
                  </button>
                )}
                <button
                  onClick={() => toggleSection("education")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.education ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.education && (
              <div className="space-y-6">
                {cvData.education && cvData.education.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyEducation()
                  ) : (
                    <div className="space-y-6">
                      {cvData.education.map((edu, idx) => (
                        <div
                          key={edu.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {edu.degree}
                              </h4>
                              <p className="text-slate-600">
                                {edu.institution}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedEducations =
                                      cvData.education.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      education: updatedEducations,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Degree
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    degree: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="B.S. in Computer Science"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Institution
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    institution: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="University of California, Berkeley"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    startDate: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Aug 2018"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={edu.endDate}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    endDate: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="May 2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    location: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Berkeley, CA"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={edu.description}
                                onChange={(e) => {
                                  const updatedEducations = [
                                    ...cvData.education,
                                  ];
                                  updatedEducations[idx] = {
                                    ...edu,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: updatedEducations,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Relevant coursework, GPA, honors, etc."
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No education added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Skills Section */}
          <section id="section-skills">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Skills & Expertise
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newSkill = prompt("Enter a new skill:");
                      if (newSkill && newSkill.trim()) {
                        setCvData((prev) => ({
                          ...prev,
                          skills: [...(prev.skills || []), newSkill.trim()],
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Skill
                  </button>
                )}
                <button
                  onClick={() => toggleSection("skills")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.skills ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.skills && (
              <div className="space-y-6">
                {cvData.skills && cvData.skills.length > 0 ? (
                  readOnly ? (
                    renderReadOnlySkills()
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-center px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-sm"
                        >
                          {skill}
                          {!readOnly && (
                            <button
                              onClick={() => {
                                const updatedSkills = cvData.skills.filter(
                                  (_, i) => i !== idx
                                );
                                setCvData((prev) => ({
                                  ...prev,
                                  skills: updatedSkills,
                                }));
                              }}
                              className="ml-2 p-1 text-slate-600 rounded-full hover:bg-slate-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No skills added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Projects Section */}
          <section id="section-projects">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Projects</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newProject = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        description: "",
                        link: "",
                        technologies: [],
                      };
                      setCvData((prev) => ({
                        ...prev,
                        projects: [...(prev.projects || []), newProject],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Project
                  </button>
                )}
                <button
                  onClick={() => toggleSection("projects")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.projects ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.projects && (
              <div className="space-y-6">
                {cvData.projects && cvData.projects.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyProjects()
                  ) : (
                    <div className="space-y-6">
                      {cvData.projects.map((project, idx) => (
                        <div
                          key={project.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {project.title}
                              </h4>
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-800 text-sm"
                                >
                                  <ExternalLink className="inline h-4 w-4 ml-1" />
                                  View Project
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedProjects =
                                      cvData.projects.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      projects: updatedProjects,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Project Title
                              </label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                  const updatedProjects = [...cvData.projects];
                                  updatedProjects[idx] = {
                                    ...project,
                                    title: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    projects: updatedProjects,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="AI Resume Builder"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Project Link
                              </label>
                              <input
                                type="url"
                                value={project.link}
                                onChange={(e) => {
                                  const updatedProjects = [...cvData.projects];
                                  updatedProjects[idx] = {
                                    ...project,
                                    link: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    projects: updatedProjects,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://github.com/user/repo"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Technologies Used (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={project.technologies.join(", ")}
                                onChange={(e) => {
                                  const updatedProjects = [...cvData.projects];
                                  updatedProjects[idx] = {
                                    ...project,
                                    technologies: e.target.value
                                      .split(",")
                                      .map((t) => t.trim())
                                      .filter(Boolean),
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    projects: updatedProjects,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="React, Node.js, Firebase"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Project Description
                              </label>
                              <textarea
                                rows="4"
                                value={project.description}
                                onChange={(e) => {
                                  const updatedProjects = [...cvData.projects];
                                  updatedProjects[idx] = {
                                    ...project,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    projects: updatedProjects,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Briefly describe the project, its purpose, and your role."
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No projects added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Accomplishments Section */}
          <section id="section-accomplishments">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Accomplishments
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newAccomplishment = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        description: "",
                        date: "",
                        type: "award",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        accomplishments: [
                          ...(prev.accomplishments || []),
                          newAccomplishment,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Accomplishment
                  </button>
                )}
                <button
                  onClick={() => toggleSection("accomplishments")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.accomplishments ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.accomplishments && (
              <div className="space-y-6">
                {cvData.accomplishments && cvData.accomplishments.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyAccomplishments()
                  ) : (
                    <div className="space-y-6">
                      {cvData.accomplishments.map((accomplishment, idx) => (
                        <div
                          key={accomplishment.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {accomplishment.title}
                              </h4>
                              <p className="text-slate-600 text-sm">
                                {accomplishment.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedAccomplishments =
                                      cvData.accomplishments.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      accomplishments: updatedAccomplishments,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={accomplishment.title}
                                onChange={(e) => {
                                  const updatedAccomplishments = [
                                    ...cvData.accomplishments,
                                  ];
                                  updatedAccomplishments[idx] = {
                                    ...accomplishment,
                                    title: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    accomplishments: updatedAccomplishments,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Employee of the Year"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={accomplishment.date}
                                onChange={(e) => {
                                  const updatedAccomplishments = [
                                    ...cvData.accomplishments,
                                  ];
                                  updatedAccomplishments[idx] = {
                                    ...accomplishment,
                                    date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    accomplishments: updatedAccomplishments,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={accomplishment.description}
                                onChange={(e) => {
                                  const updatedAccomplishments = [
                                    ...cvData.accomplishments,
                                  ];
                                  updatedAccomplishments[idx] = {
                                    ...accomplishment,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    accomplishments: updatedAccomplishments,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe the accomplishment and its significance"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No accomplishments added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Portfolio Section */}
          <section id="section-portfolio">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Portfolio</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newPortfolioItem = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        description: "",
                        url: "",
                        type: "project",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        portfolio: [
                          ...(prev.portfolio || []),
                          newPortfolioItem,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Portfolio Item
                  </button>
                )}
                <button
                  onClick={() => toggleSection("portfolio")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.portfolio ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.portfolio && (
              <div className="space-y-6">
                {cvData.portfolio && cvData.portfolio.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyPortfolio()
                  ) : (
                    <div className="space-y-6">
                      {cvData.portfolio.map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {item.title}
                              </h4>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-800 text-sm"
                                >
                                  <ExternalLink className="inline h-4 w-4 ml-1" />
                                  View Project
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedPortfolio =
                                      cvData.portfolio.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      portfolio: updatedPortfolio,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updatedPortfolio = [
                                    ...cvData.portfolio,
                                  ];
                                  updatedPortfolio[idx] = {
                                    ...item,
                                    title: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    portfolio: updatedPortfolio,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Website Redesign"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                URL
                              </label>
                              <input
                                type="url"
                                value={item.url}
                                onChange={(e) => {
                                  const updatedPortfolio = [
                                    ...cvData.portfolio,
                                  ];
                                  updatedPortfolio[idx] = {
                                    ...item,
                                    url: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    portfolio: updatedPortfolio,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://example.com"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={item.description}
                                onChange={(e) => {
                                  const updatedPortfolio = [
                                    ...cvData.portfolio,
                                  ];
                                  updatedPortfolio[idx] = {
                                    ...item,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    portfolio: updatedPortfolio,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe the project and your role"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No portfolio items added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Publications Section */}
          <section id="section-publications">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Publications
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newPublication = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        description: "",
                        url: "",
                        publisher: "",
                        date: "",
                        type: "journal",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        publications: [
                          ...(prev.publications || []),
                          newPublication,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Publication
                  </button>
                )}
                <button
                  onClick={() => toggleSection("publications")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.publications ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.publications && (
              <div className="space-y-6">
                {cvData.publications && cvData.publications.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyPublications()
                  ) : (
                    <div className="space-y-6">
                      {cvData.publications.map((publication, idx) => (
                        <div
                          key={publication.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {publication.title}
                              </h4>
                              <p className="text-slate-600 text-sm">
                                {publication.publisher} • {publication.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedPublications =
                                      cvData.publications.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      publications: updatedPublications,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={publication.title}
                                onChange={(e) => {
                                  const updatedPublications = [
                                    ...cvData.publications,
                                  ];
                                  updatedPublications[idx] = {
                                    ...publication,
                                    title: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    publications: updatedPublications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Machine Learning in Healthcare"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Publisher
                              </label>
                              <input
                                type="text"
                                value={publication.publisher}
                                onChange={(e) => {
                                  const updatedPublications = [
                                    ...cvData.publications,
                                  ];
                                  updatedPublications[idx] = {
                                    ...publication,
                                    publisher: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    publications: updatedPublications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Journal of AI Research"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={publication.date}
                                onChange={(e) => {
                                  const updatedPublications = [
                                    ...cvData.publications,
                                  ];
                                  updatedPublications[idx] = {
                                    ...publication,
                                    date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    publications: updatedPublications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                URL
                              </label>
                              <input
                                type="url"
                                value={publication.url}
                                onChange={(e) => {
                                  const updatedPublications = [
                                    ...cvData.publications,
                                  ];
                                  updatedPublications[idx] = {
                                    ...publication,
                                    url: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    publications: updatedPublications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://example.com/paper"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={publication.description}
                                onChange={(e) => {
                                  const updatedPublications = [
                                    ...cvData.publications,
                                  ];
                                  updatedPublications[idx] = {
                                    ...publication,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    publications: updatedPublications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Brief summary of the publication"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No publications added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Patents Section */}
          <section id="section-patents">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Patents</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newPatent = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        title: "",
                        description: "",
                        patent_number: "",
                        date: "",
                        status: "pending",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        patents: [...(prev.patents || []), newPatent],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Patent
                  </button>
                )}
                <button
                  onClick={() => toggleSection("patents")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.patents ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.patents && (
              <div className="space-y-6">
                {cvData.patents && cvData.patents.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyPatents()
                  ) : (
                    <div className="space-y-6">
                      {cvData.patents.map((patent, idx) => (
                        <div
                          key={patent.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {patent.title}
                              </h4>
                              <p className="text-slate-600 text-sm">
                                {patent.patent_number} • {patent.date} •{" "}
                                {patent.status}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedPatents =
                                      cvData.patents.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      patents: updatedPatents,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={patent.title}
                                onChange={(e) => {
                                  const updatedPatents = [...cvData.patents];
                                  updatedPatents[idx] = {
                                    ...patent,
                                    title: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    patents: updatedPatents,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="System for Data Processing"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Patent Number
                              </label>
                              <input
                                type="text"
                                value={patent.patent_number}
                                onChange={(e) => {
                                  const updatedPatents = [...cvData.patents];
                                  updatedPatents[idx] = {
                                    ...patent,
                                    patent_number: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    patents: updatedPatents,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="US12345678"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={patent.date}
                                onChange={(e) => {
                                  const updatedPatents = [...cvData.patents];
                                  updatedPatents[idx] = {
                                    ...patent,
                                    date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    patents: updatedPatents,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                              </label>
                              <select
                                value={patent.status}
                                onChange={(e) => {
                                  const updatedPatents = [...cvData.patents];
                                  updatedPatents[idx] = {
                                    ...patent,
                                    status: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    patents: updatedPatents,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                disabled={readOnly}
                              >
                                <option value="pending">Pending</option>
                                <option value="granted">Granted</option>
                                <option value="expired">Expired</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={patent.description}
                                onChange={(e) => {
                                  const updatedPatents = [...cvData.patents];
                                  updatedPatents[idx] = {
                                    ...patent,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    patents: updatedPatents,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe the patent and its application"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No patents added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Languages Section */}
          <section id="section-languages">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Languages</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newLanguage = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        name: "",
                        proficiency: "intermediate",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        languages: [...(prev.languages || []), newLanguage],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Language
                  </button>
                )}
                <button
                  onClick={() => toggleSection("languages")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.languages ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.languages && (
              <div className="space-y-6">
                {cvData.languages && cvData.languages.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyLanguages()
                  ) : (
                    <div className="space-y-6">
                      {cvData.languages.map((language, idx) => (
                        <div
                          key={language.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {language.name}
                              </h4>
                              <p className="text-slate-600 text-sm capitalize">
                                {language.proficiency}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedLanguages =
                                      cvData.languages.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      languages: updatedLanguages,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Language
                              </label>
                              <input
                                type="text"
                                value={language.name}
                                onChange={(e) => {
                                  const updatedLanguages = [
                                    ...cvData.languages,
                                  ];
                                  updatedLanguages[idx] = {
                                    ...language,
                                    name: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    languages: updatedLanguages,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Spanish"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Proficiency
                              </label>
                              <select
                                value={language.proficiency}
                                onChange={(e) => {
                                  const updatedLanguages = [
                                    ...cvData.languages,
                                  ];
                                  updatedLanguages[idx] = {
                                    ...language,
                                    proficiency: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    languages: updatedLanguages,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                disabled={readOnly}
                              >
                                <option value="basic">Basic</option>
                                <option value="intermediate">
                                  Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                                <option value="native">Native</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No languages added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Certifications Section */}
          <section id="section-certifications">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Certifications
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newCertification = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        name: "",
                        issuer: "",
                        date: "",
                        credential_id: "",
                        credential_url: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        certifications: [
                          ...(prev.certifications || []),
                          newCertification,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Certification
                  </button>
                )}
                <button
                  onClick={() => toggleSection("certifications")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.certifications ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.certifications && (
              <div className="space-y-6">
                {cvData.certifications && cvData.certifications.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyCertifications()
                  ) : (
                    <div className="space-y-6">
                      {cvData.certifications.map((certification, idx) => (
                        <div
                          key={certification.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {certification.name}
                              </h4>
                              <p className="text-slate-600 text-sm">
                                {certification.issuer} • {certification.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedCertifications =
                                      cvData.certifications.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      certifications: updatedCertifications,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Certification Name
                              </label>
                              <input
                                type="text"
                                value={certification.name}
                                onChange={(e) => {
                                  const updatedCertifications = [
                                    ...cvData.certifications,
                                  ];
                                  updatedCertifications[idx] = {
                                    ...certification,
                                    name: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    certifications: updatedCertifications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="AWS Certified Solutions Architect"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Issuer
                              </label>
                              <input
                                type="text"
                                value={certification.issuer}
                                onChange={(e) => {
                                  const updatedCertifications = [
                                    ...cvData.certifications,
                                  ];
                                  updatedCertifications[idx] = {
                                    ...certification,
                                    issuer: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    certifications: updatedCertifications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Amazon Web Services"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={certification.date}
                                onChange={(e) => {
                                  const updatedCertifications = [
                                    ...cvData.certifications,
                                  ];
                                  updatedCertifications[idx] = {
                                    ...certification,
                                    date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    certifications: updatedCertifications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="2022"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Credential ID
                              </label>
                              <input
                                type="text"
                                value={certification.credential_id}
                                onChange={(e) => {
                                  const updatedCertifications = [
                                    ...cvData.certifications,
                                  ];
                                  updatedCertifications[idx] = {
                                    ...certification,
                                    credential_id: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    certifications: updatedCertifications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="AWS-ASA-123456"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Credential URL
                              </label>
                              <input
                                type="url"
                                value={certification.credential_url}
                                onChange={(e) => {
                                  const updatedCertifications = [
                                    ...cvData.certifications,
                                  ];
                                  updatedCertifications[idx] = {
                                    ...certification,
                                    credential_url: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    certifications: updatedCertifications,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://aws.amazon.com/verification"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No certifications added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Volunteering Section */}
          <section id="section-volunteering">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Volunteering
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newVolunteering = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        organization: "",
                        role: "",
                        start_date: "",
                        end_date: "",
                        description: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        volunteering: [
                          ...(prev.volunteering || []),
                          newVolunteering,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Volunteering
                  </button>
                )}
                <button
                  onClick={() => toggleSection("volunteering")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.volunteering ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.volunteering && (
              <div className="space-y-6">
                {cvData.volunteering && cvData.volunteering.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyVolunteering()
                  ) : (
                    <div className="space-y-6">
                      {cvData.volunteering.map((volunteer, idx) => (
                        <div
                          key={volunteer.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {volunteer.role}
                              </h4>
                              <p className="text-slate-600 text-sm">
                                {volunteer.organization}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedVolunteering =
                                      cvData.volunteering.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      volunteering: updatedVolunteering,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Organization
                              </label>
                              <input
                                type="text"
                                value={volunteer.organization}
                                onChange={(e) => {
                                  const updatedVolunteering = [
                                    ...cvData.volunteering,
                                  ];
                                  updatedVolunteering[idx] = {
                                    ...volunteer,
                                    organization: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    volunteering: updatedVolunteering,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Red Cross"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                              </label>
                              <input
                                type="text"
                                value={volunteer.role}
                                onChange={(e) => {
                                  const updatedVolunteering = [
                                    ...cvData.volunteering,
                                  ];
                                  updatedVolunteering[idx] = {
                                    ...volunteer,
                                    role: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    volunteering: updatedVolunteering,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Volunteer Coordinator"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={volunteer.start_date}
                                onChange={(e) => {
                                  const updatedVolunteering = [
                                    ...cvData.volunteering,
                                  ];
                                  updatedVolunteering[idx] = {
                                    ...volunteer,
                                    start_date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    volunteering: updatedVolunteering,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Jan 2020"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={volunteer.end_date}
                                onChange={(e) => {
                                  const updatedVolunteering = [
                                    ...cvData.volunteering,
                                  ];
                                  updatedVolunteering[idx] = {
                                    ...volunteer,
                                    end_date: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    volunteering: updatedVolunteering,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Present"
                                disabled={readOnly}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                              </label>
                              <textarea
                                rows="4"
                                value={volunteer.description}
                                onChange={(e) => {
                                  const updatedVolunteering = [
                                    ...cvData.volunteering,
                                  ];
                                  updatedVolunteering[idx] = {
                                    ...volunteer,
                                    description: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    volunteering: updatedVolunteering,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe your volunteering activities and impact"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No volunteering experience added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Interests Section */}
          <section id="section-interests">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Interests</h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newInterest = prompt("Enter a new interest:");
                      if (newInterest && newInterest.trim()) {
                        setCvData((prev) => ({
                          ...prev,
                          interests: [
                            ...(prev.interests || []),
                            newInterest.trim(),
                          ],
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Interest
                  </button>
                )}
                <button
                  onClick={() => toggleSection("interests")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.interests ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.interests && (
              <div className="space-y-6">
                {cvData.interests && cvData.interests.length > 0 ? (
                  readOnly ? (
                    renderReadOnlyInterests()
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cvData.interests.map((interest, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-primary-100 text-primary-700 font-medium rounded-full text-sm"
                        >
                          {interest}
                          {!readOnly && (
                            <button
                              onClick={() => {
                                const updatedInterests =
                                  cvData.interests.filter((_, i) => i !== idx);
                                setCvData((prev) => ({
                                  ...prev,
                                  interests: updatedInterests,
                                }));
                              }}
                              className="ml-2 p-1 text-slate-600 rounded-full hover:bg-slate-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No interests added yet</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Social Media Section */}
          <section id="section-social">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Social Media
              </h3>
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => {
                      const newSocialMedia = {
                        id: crypto.randomUUID(),
                        isPersisted: false,
                        platform: "",
                        url: "",
                      };
                      setCvData((prev) => ({
                        ...prev,
                        social_media: [
                          ...(prev.social_media || []),
                          newSocialMedia,
                        ],
                      }));
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Social Media
                  </button>
                )}
                <button
                  onClick={() => toggleSection("social")}
                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {expandedSections.social ? "▼" : "▶"}
                </button>
              </div>
            </div>
            {expandedSections.social && (
              <div className="space-y-6">
                {cvData.social_media && cvData.social_media.length > 0 ? (
                  readOnly ? (
                    renderReadOnlySocial()
                  ) : (
                    <div className="space-y-6">
                      {cvData.social_media.map((social, idx) => (
                        <div
                          key={social.id}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {social.platform}
                              </h4>
                            </div>
                            <div className="flex gap-2">
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    const updatedSocialMedia =
                                      cvData.social_media.filter(
                                        (_, i) => i !== idx
                                      );
                                    setCvData((prev) => ({
                                      ...prev,
                                      social_media: updatedSocialMedia,
                                    }));
                                  }}
                                  className="p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Platform
                              </label>
                              <input
                                type="text"
                                value={social.platform}
                                onChange={(e) => {
                                  const updatedSocialMedia = [
                                    ...cvData.social_media,
                                  ];
                                  updatedSocialMedia[idx] = {
                                    ...social,
                                    platform: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    social_media: updatedSocialMedia,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Twitter"
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                URL
                              </label>
                              <input
                                type="url"
                                value={social.url}
                                onChange={(e) => {
                                  const updatedSocialMedia = [
                                    ...cvData.social_media,
                                  ];
                                  updatedSocialMedia[idx] = {
                                    ...social,
                                    url: e.target.value,
                                  };
                                  setCvData((prev) => ({
                                    ...prev,
                                    social_media: updatedSocialMedia,
                                  }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://twitter.com/username"
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      No social media profiles added yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Bottom nav removed — the editor is continuous, changes persist per-section */}
      </div>
    </div>
  );
};

export default CVEditorComponent;
