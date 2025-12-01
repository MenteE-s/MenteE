import React, { useState, useEffect } from "react";
// --- FIX: Import Router ---
import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
} from "lucide-react";
import { API_BASE } from "../../config";

// Helper component for loading
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-slate-600">Loading Profile...</p>
    </div>
  </div>
);

// Helper component for errors
const ErrorScreen = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-slate-600 mb-6">
        {message ||
          "Could not load the requested profile. It may no longer exist or the link may be incorrect."}
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

// Helper function to format dates (e.g., "Jan 2022")
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase() === "present") return "Present";
  try {
    const date = new Date(dateStr.split("T")[0]);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (e) {
    return dateStr; // Return the string as-is if it's not a parsable date
  }
};

// --- FIX: Renamed main component ---
function ShareableProfileComponent() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId) {
      setError("No profile ID was provided.");
      setIsLoading(false);
      return;
    }

    const fetchPublicProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/public/profile/${profileId}`);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfile();
  }, [profileId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!profile) {
    return <ErrorScreen message="Profile data is empty." />;
  }

  // --- Helper function to format text with newlines ---
  const formatDescription = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <p key={index} className="mb-1">
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-serif">
      <div className="max-w-4xl mx-auto bg-white shadow-xl">
        {/* --- Header / Personal Details --- */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-slate-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {profile.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "CV"}
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-5xl font-bold mb-3 text-white">
                {profile.full_name || "Your Name"}
              </h1>
              <p className="text-xl text-slate-300 mb-4">
                {profile.title || "Professional Title"}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex gap-4">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-12">
          {/* --- Summary --- */}
          {profile.summary && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Professional Summary
              </h3>
              <div className="text-slate-700 text-lg leading-relaxed">
                {formatDescription(profile.summary)}
              </div>
            </section>
          )}

          {/* --- Skills --- */}
          {profile.skills && profile.skills.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.skill_id}
                    className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg font-semibold text-sm shadow-sm"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* --- Work Experience --- */}
          {profile.work_experiences && profile.work_experiences.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Work Experience
              </h3>
              <div className="space-y-8">
                {profile.work_experiences.map((exp) => (
                  <div
                    key={exp.experience_id}
                    className="relative pl-8 border-l-4 border-slate-200"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-600 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-1">
                          {exp.job_title}
                        </h4>
                        <h5 className="text-xl text-slate-600 font-medium mb-2">
                          {exp.company}
                        </h5>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-medium">
                          {formatDate(exp.start_date)} –{" "}
                          {formatDate(exp.end_date)}
                        </span>
                        {exp.location && (
                          <p className="text-slate-500 text-sm mt-1">
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Projects --- */}
          {profile.projects && profile.projects.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Projects
              </h3>
              <div className="space-y-8">
                {profile.projects.map((proj) => (
                  <div
                    key={proj.project_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {proj.title}
                      </h4>
                      {proj.project_url && (
                        <a
                          href={proj.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-800 font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Project
                        </a>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {proj.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(proj.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Education --- */}
          {profile.educations && profile.educations.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Education
              </h3>
              <div className="space-y-8">
                {profile.educations.map((edu) => (
                  <div
                    key={edu.education_id}
                    className="relative pl-8 border-l-4 border-slate-200"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-600 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-1">
                          {edu.degree}
                        </h4>
                        <h5 className="text-xl text-slate-600 font-medium mb-2">
                          {edu.institution}
                        </h5>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-medium">
                          {formatDate(edu.start_date)} –{" "}
                          {formatDate(edu.end_date)}
                        </span>
                        {edu.location && (
                          <p className="text-slate-500 text-sm mt-1">
                            {edu.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(edu.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Certifications --- */}
          {profile.certifications && profile.certifications.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Certifications
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.certifications.map((cert) => (
                  <div
                    key={cert.certification_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-slate-800">
                        {cert.title}
                      </h4>
                      <span className="text-slate-500 font-medium text-sm">
                        {formatDate(cert.date)}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Awards --- */}
          {profile.awards && profile.awards.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Awards & Achievements
              </h3>
              <div className="space-y-6">
                {profile.awards.map((award) => (
                  <div
                    key={award.award_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-slate-800">
                        {award.title}
                      </h4>
                      <span className="text-slate-500 font-medium">
                        {formatDate(award.date)}
                      </span>
                    </div>
                    {award.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(award.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Publications --- */}
          {profile.publications && profile.publications.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Publications
              </h3>
              <div className="space-y-8">
                {profile.publications.map((pub) => (
                  <div
                    key={pub.publication_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {pub.title}
                      </h4>
                      <span className="text-slate-500 font-medium">
                        {formatDate(pub.date)}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium mb-3">
                      {pub.publisher}
                    </p>
                    {pub.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(pub.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Patents --- */}
          {profile.patents && profile.patents.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Patents
              </h3>
              <div className="space-y-8">
                {profile.patents.map((patent) => (
                  <div
                    key={patent.patent_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {patent.title}
                      </h4>
                      <span className="text-slate-500 font-medium">
                        {formatDate(patent.date)}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium mb-3">
                      Patent Number: {patent.patent_number}
                    </p>
                    {patent.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(patent.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Languages --- */}
          {profile.languages && profile.languages.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Languages
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {profile.languages.map((lang) => (
                  <div
                    key={lang.language_id}
                    className="bg-slate-50 p-6 rounded-lg text-center"
                  >
                    <h4 className="text-xl font-bold text-slate-800 mb-2">
                      {lang.name}
                    </h4>
                    <span className="text-slate-600 font-medium capitalize">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Volunteering --- */}
          {profile.volunteering && profile.volunteering.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Volunteering
              </h3>
              <div className="space-y-8">
                {profile.volunteering.map((vol) => (
                  <div
                    key={vol.volunteering_id}
                    className="relative pl-8 border-l-4 border-slate-200"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-600 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-1">
                          {vol.role}
                        </h4>
                        <h5 className="text-xl text-slate-600 font-medium mb-2">
                          {vol.organization}
                        </h5>
                      </div>
                      <span className="text-slate-500 font-medium">
                        {formatDate(vol.start_date)} –{" "}
                        {formatDate(vol.end_date)}
                      </span>
                    </div>
                    {vol.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(vol.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Courses --- */}
          {profile.courses && profile.courses.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Courses & Training
              </h3>
              <div className="space-y-6">
                {profile.courses.map((course) => (
                  <div
                    key={course.course_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-slate-600 font-medium">
                          {course.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-medium">
                          {formatDate(course.completion_date)}
                        </span>
                        {course.url && (
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-800 flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Certificate
                          </a>
                        )}
                      </div>
                    </div>
                    {course.description && (
                      <div className="text-slate-700 leading-relaxed mt-3">
                        {formatDescription(course.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Portfolio Items --- */}
          {profile.portfolio_items && profile.portfolio_items.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Portfolio
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.portfolio_items.map((item) => (
                  <div
                    key={item.portfolio_item_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-slate-800">
                        {item.title}
                      </h4>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-800 flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </a>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-slate-700 leading-relaxed">
                        {formatDescription(item.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Interests --- */}
          {profile.interests && profile.interests.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Interests
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.interests.map((interest) => (
                  <span
                    key={interest.interest_id}
                    className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg font-semibold text-sm shadow-sm"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* --- Social Profiles --- */}
          {profile.social_profiles && profile.social_profiles.length > 0 && (
            <section className="mb-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                Connect With Me
              </h3>
              <div className="flex flex-wrap gap-4">
                {profile.social_profiles.map((social) => (
                  <a
                    key={social.social_profile_id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    <span>{social.platform}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* --- References --- */}
          {profile.references && profile.references.length > 0 && (
            <section>
              <h3 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide border-b-4 border-slate-300 pb-2">
                References
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.references.map((ref) => (
                  <div
                    key={ref.reference_id}
                    className="bg-slate-50 p-6 rounded-lg"
                  >
                    <h4 className="text-xl font-bold text-slate-800 mb-3">
                      {ref.name}
                    </h4>
                    <p className="text-slate-600 font-medium mb-2">
                      {ref.relationship}
                    </p>
                    <div className="space-y-1 text-sm text-slate-600">
                      {ref.email && (
                        <p>
                          <a
                            href={`mailto:${ref.email}`}
                            className="text-slate-700 hover:text-slate-900 underline"
                          >
                            {ref.email}
                          </a>
                        </p>
                      )}
                      {ref.phone && <p>{ref.phone}</p>}
                      {ref.contact && <p>{ref.contact}</p>}
                    </div>
                    {ref.notes && (
                      <div className="text-slate-700 leading-relaxed mt-3 pt-3 border-t border-slate-200">
                        {formatDescription(ref.notes)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// --- FIX: Wrap default export in Router for preview compatibility ---
export default ShareableProfileComponent;
