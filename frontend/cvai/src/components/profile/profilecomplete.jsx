import React, { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { Link, useParams } from "react-router-dom";
import { showSuccess } from "../../utils/toast";
import CVEditorComponent from "../Editor/cvEditor";

const ProfilePage = () => {
  const { profileId } = useParams();
  const [profileIdFromMe, setProfileIdFromMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If profileId is present in the URL we let CVEditor fetch the public profile directly.
    if (profileId) {
      setLoading(false);
      return;
    }

    const fetchMyProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfileIdFromMe(data.profile?.profile_id ?? null);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading profile�</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const idToShow = profileId || profileIdFromMe;

  // If we have a profile id — render a top share bar and the editor in read-only mode (resume view).
  if (idToShow) {
    const shareUrl = `${window.location.origin}/share/${idToShow}`;

    const copyShareLink = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Share link copied to clipboard");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700 font-medium">
                Public share link
              </div>
              <div className="text-sm text-slate-500">
                Anyone with this link can view your public profile
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="px-3 py-2 rounded-lg border border-gray-200 w-80 text-sm text-slate-700 bg-gray-50"
              />
              <button
                onClick={copyShareLink}
                className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
              >
                Copy
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                Open
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <CVEditorComponent profileIdProp={idToShow} readOnly={true} />
        </div>
      </div>
    );
  }

  // Nothing to show
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          No profile to display
        </h2>
        <p className="text-slate-600 mb-6">
          This page shows a user's resume-style profile when available. Sign in
          to view your profile, or visit a public profile link.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Sign in
          </Link>
          <Link to="/" className="px-4 py-2 border border-slate-200 rounded-md">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
