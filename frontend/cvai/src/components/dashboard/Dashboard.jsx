import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// --- NEW: Import icons for modal ---
import {
  FilePenLine,
  Share2,
  Trash2,
  X,
  Clipboard,
  Check,
  Crown,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { API_BASE } from "../../config";
// import { toast } from 'react-hot-toast'; // You can uncomment this

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null); // For selection effect

  // --- NEW: State for Share Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToShare, setProfileToShare] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check if user has pro plan
  const hasProPlan = user?.plan === "pro";

  useEffect(() => {
    // Get user from local storage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // This shouldn't happen if ProtectedRoute is working
        throw new Error("User data not found in local storage.");
      }
    } catch (err) {
      setError("Failed to load user data from storage.");
      console.error("Error parsing user data from localStorage:", err);
    }

    // Fetch profiles
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authorization token found.");
        }
        const response = await fetch(`${API_BASE}/profiles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch profiles");
        }

        const data = await response.json();
        setProfiles(data.profiles || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []); // Runs once on mount

  const handleDeleteProfile = async (profileId) => {
    // Optional: Add a confirmation dialog here
    // if (!window.confirm("Are you sure you want to delete this profile?")) {
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/profile/${profileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete profile");
      }

      // Remove profile from state to update UI immediately
      setProfiles((prevProfiles) =>
        prevProfiles.filter((p) => p.profile_id !== profileId)
      );
      // toast.success("Profile deleted successfully"); // Uncomment if using toast
    } catch (err) {
      setError(err.message);
      console.error("Error deleting profile:", err);
      // toast.error(`Error: ${err.message}`); // Uncomment if using toast
    }
  };

  // --- NEW: Functions to handle Share Modal ---
  const handleShareClick = (profile) => {
    setProfileToShare(profile);
    setIsModalOpen(true);
    setCopied(false); // Reset copied state
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProfileToShare(null);
  };

  const copyToClipboard = () => {
    if (!profileToShare) return;
    const shareUrl = `${window.location.origin}/share/${profileToShare.profile_id}`;

    // Using a textarea element to copy text
    const ta = document.createElement("textarea");
    ta.value = shareUrl;
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // toast.error('Failed to copy link'); // Uncomment
    }
    document.body.removeChild(ta);
  };

  // --- END NEW FUNCTIONS ---

  // Compute aggregated stats across user profiles
  const totalViews = profiles.reduce((sum, p) => sum + (p.total_views || 0), 0);
  const interviewsTotal = profiles.reduce(
    (sum, p) => sum + (p.interviews_count || 0),
    0
  );
  const avgScore = profiles.length
    ? Math.round(
        profiles.reduce((sum, p) => sum + (p.avg_score_percent || 0), 0) /
          profiles.length
      )
    : 0;
  const successRateAvg = profiles.length
    ? Math.round(
        profiles.reduce((sum, p) => sum + (p.success_rate_percent || 0), 0) /
          profiles.length
      )
    : 0;

  const formattedNumber = (n) => n.toLocaleString();

  const mockStats = hasProPlan
    ? [
        {
          label: "Total Views",
          value: formattedNumber(totalViews),
          icon: "👁️",
        },
        { label: "Avg. Score", value: `${avgScore}%`, icon: "⭐" },
        {
          label: "Interviews",
          value: formattedNumber(interviewsTotal),
          icon: "🎤",
        },
        { label: "Success Rate", value: `${successRateAvg}%`, icon: "🏆" },
      ]
    : [
        { label: "Profile Views", value: "Limited", icon: "👁️" },
        { label: "Avg. Score", value: "Hidden", icon: "⭐" },
        { label: "Interviews", value: "Hidden", icon: "🎤" },
        { label: "Success Rate", value: "Hidden", icon: "🏆" },
      ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {" "}
      {/* --- NEW: Fragment wrapper --- */}
      <div className="min-h-screen p-6 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.username || "User"}! 👋
            </h1>
            <p className="text-slate-600">
              Track your progress and manage your profiles
            </p>
          </div>

          {/* NOTE: Stats Grid moved into right column for better placement */}

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Profiles */}
            <div className="lg:col-span-2">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Your Profile Statistics
                  </h2>
                </div>

                {/* --- Error Message --- */}
                {error && (
                  <div className="text-center py-12 text-red-600">
                    <p className="text-xl font-semibold">Error: {error}</p>
                  </div>
                )}

                {/* --- Profiles List --- */}
                <div className="space-y-4">
                  {!error && profiles.length > 0 ? (
                    profiles.map((profile, idx) => (
                      <div
                        key={profile.profile_id}
                        className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                          selectedProfile === profile.profile_id
                            ? "border-primary-500 bg-primary-50 shadow-md"
                            : "border-slate-200 hover:border-primary-400 hover:bg-primary-50"
                        }`}
                        onClick={() => setSelectedProfile(profile.profile_id)}
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-slate-900">
                                {profile.title || "Untitled Profile"}
                              </h3>
                              {/* Pro plan badge */}
                              {profile.isPro && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Pro
                                </span>
                              )}
                              {/* Free plan badge */}
                              {!profile.isPro && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                  Free
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              Updated{" "}
                              {new Date(
                                profile.updated_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-slate-600">
                                Profile Score
                              </p>
                              <p className="text-xl font-bold text-primary-600">
                                {profile.avg_score_percent
                                  ? Math.round(profile.avg_score_percent) + "%"
                                  : "0%"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600">Views</p>
                              <p className="text-xl font-bold text-slate-900">
                                {profile.total_views ? profile.total_views : 0}
                              </p>
                            </div>

                            {/* --- UPDATED: Icon Buttons --- */}
                            <div className="flex gap-2">
                              {/* --- Edit Button --- */}
                              <Link
                                to={`/editor/${profile.profile_id}`}
                                className="p-2 text-slate-600 rounded-md hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                title="Edit"
                              >
                                <FilePenLine className="h-5 w-5" />
                              </Link>

                              {/* --- Share Button --- */}
                              <button
                                onClick={() => handleShareClick(profile)}
                                className="p-2 text-slate-600 rounded-md hover:bg-accent-100 hover:text-accent-600 transition-colors"
                                title="Share"
                              >
                                <Share2 className="h-5 w-5" />
                              </button>

                              {/* --- Delete Button --- */}
                              <button
                                onClick={() =>
                                  handleDeleteProfile(profile.profile_id)
                                }
                                className="p-2 text-slate-600 rounded-md hover:bg-danger hover:text-danger transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 mb-4">No profiles yet</p>
                      <Link
                        to="/editor"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Create Your First Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions + Tips */}
            <div className="space-y-6">
              {/* Stats Grid (moved here from top) */}
              <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
                {mockStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-600">
                        {stat.label}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-800">
                        {stat.icon}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-primary-600">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-8 rounded-2xl shadow-sm bg-gradient-primary text-white">
                <h3 className="text-xl font-bold mb-4">⚡ Quick Start</h3>
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="block p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  >
                    👤 View My Profile
                  </Link>
                  {/* Removed 'View Your Account' to avoid duplication with profile page */}
                  <Link
                    to="/analytics"
                    className="block p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  >
                    📊 View Analytics
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-slate-900 mb-4">💡 Pro Tips</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Update your profile regularly</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Use keywords from job postings</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Keep descriptions concise</span>
                  </li>
                </ul>
              </div>

              {/* Pro Plan Features Card */}
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900">
                    Pro Plan Features
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited profile views and analytics</span>
                  </li>
                  <li className="flex gap-2">
                    <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Advanced job matching and recommendations</span>
                  </li>
                  <li className="flex gap-2">
                    <Shield className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Priority support and profile reviews</span>
                  </li>
                </ul>
                {!hasProPlan && (
                  <Link
                    to="/pricing"
                    className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:shadow-glow transition-all text-center block"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- NEW: Share Profile Modal --- */}
      {isModalOpen && profileToShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">
                Share Profile
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-500 rounded-full hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <p className="text-slate-600 mb-4">
              This link is public and can be viewed by anyone.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/share/${profileToShare.profile_id}`}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm bg-slate-50 text-slate-700 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  copied
                    ? "bg-success hover:bg-success"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Clipboard className="h-5 w-5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">
                Copied to clipboard!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
