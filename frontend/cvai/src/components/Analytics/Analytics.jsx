import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  ExternalLink,
  Users,
  TrendingUp,
  Download,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Analytics = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d
  const [currentPage, setCurrentPage] = useState(1);
  const organizationsPerPage = 3; // Number of organizations to show per page

  useEffect(() => {
    // Get user from local storage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error parsing user data from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock data for analytics
  const mockAnalyticsData = {
    profileViews: {
      total: 1250,
      change: "+12.5%",
      trend: "up",
      daily: [45, 52, 38, 65, 59, 72, 68],
    },
    profileShares: {
      total: 320,
      change: "+8.2%",
      trend: "up",
      daily: [12, 15, 8, 18, 14, 22, 19],
    },
    downloads: {
      total: 156,
      change: "-3.1%",
      trend: "down",
      daily: [5, 8, 3, 9, 7, 11, 6],
    },
    organizations: [
      {
        id: 1,
        name: "Google",
        logo: "https://logo.clearbit.com/google.com",
        views: 142,
        shares: 28,
        downloads: 15,
        industry: "Technology",
        location: "Mountain View, CA",
        lastViewed: "2023-11-10",
      },
      {
        id: 2,
        name: "Microsoft",
        logo: "https://logo.clearbit.com/microsoft.com",
        views: 98,
        shares: 21,
        downloads: 12,
        industry: "Technology",
        location: "Redmond, WA",
        lastViewed: "2023-11-09",
      },
      {
        id: 3,
        name: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        views: 87,
        shares: 19,
        downloads: 8,
        industry: "E-commerce",
        location: "Seattle, WA",
        lastViewed: "2023-11-08",
      },
      {
        id: 4,
        name: "Meta",
        logo: "https://logo.clearbit.com/meta.com",
        views: 76,
        shares: 16,
        downloads: 10,
        industry: "Technology",
        location: "Menlo Park, CA",
        lastViewed: "2023-11-07",
      },
      {
        id: 5,
        name: "Apple",
        logo: "https://logo.clearbit.com/apple.com",
        views: 65,
        shares: 14,
        downloads: 7,
        industry: "Technology",
        location: "Cupertino, CA",
        lastViewed: "2023-11-06",
      },
    ],
    performance: {
      overall: 87,
      sections: {
        experience: 92,
        education: 85,
        skills: 88,
        projects: 83,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Track your profile performance and engagement metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Time Range:
              </span>
              <div className="flex rounded-md overflow-hidden">
                <button
                  onClick={() => setTimeRange("7d")}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === "7d"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  } border border-slate-300`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30d")}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === "30d"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  } border border-slate-300 border-l-0`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setTimeRange("90d")}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === "90d"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  } border border-slate-300 border-l-0`}
                >
                  Last 90 Days
                </button>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">
                Profile Views
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  mockAnalyticsData.profileViews.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {mockAnalyticsData.profileViews.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {mockAnalyticsData.profileViews.total.toLocaleString()}
            </p>
            <div className="mt-4 h-12 flex items-end">
              {mockAnalyticsData.profileViews.daily.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-indigo-500 rounded-t-sm"
                  style={{ height: `${(value / 72) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">
                Profile Shares
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  mockAnalyticsData.profileShares.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {mockAnalyticsData.profileShares.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {mockAnalyticsData.profileShares.total.toLocaleString()}
            </p>
            <div className="mt-4 h-12 flex items-end">
              {mockAnalyticsData.profileShares.daily.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-purple-500 rounded-t-sm"
                  style={{ height: `${(value / 22) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Downloads</h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  mockAnalyticsData.downloads.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {mockAnalyticsData.downloads.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {mockAnalyticsData.downloads.total.toLocaleString()}
            </p>
            <div className="mt-4 h-12 flex items-end">
              {mockAnalyticsData.downloads.daily.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-teal-500 rounded-t-sm"
                  style={{ height: `${(value / 11) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">
                Unique Organizations
              </h3>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                +15.3%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {mockAnalyticsData.organizations.length}
            </p>
            <div className="mt-4 flex items-center">
              <Building className="h-5 w-5 text-slate-400 mr-2" />
              <span className="text-sm text-slate-600">Top: Google</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Who Viewed Your Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Who Viewed Your Profile
                </h2>
                <Link
                  to="/organizations"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Shares
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Last Viewed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAnalyticsData.organizations
                      .slice(
                        (currentPage - 1) * organizationsPerPage,
                        currentPage * organizationsPerPage
                      )
                      .map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/organization/${org.id}`}
                            className="flex items-center text-sm font-medium text-slate-900 hover:text-primary-600"
                          >
                            <img
                              className="h-8 w-8 rounded-full mr-3"
                              src={org.logo}
                              alt={org.name}
                            />
                            {org.name}
                            <ExternalLink className="h-3 w-3 ml-1 text-slate-400" />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-slate-400" />
                          {org.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                          <Share2 className="h-4 w-4 mr-1 text-slate-400" />
                          {org.shares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                          <Download className="h-4 w-4 mr-1 text-slate-400" />
                          {org.downloads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {org.lastViewed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-accent-50 border-t border-primary-100 flex items-center justify-between">
                  <div className="text-sm text-slate-700">
                    Showing <span className="font-medium text-primary-600">{(currentPage - 1) * organizationsPerPage + 1}</span> to{" "}
                    <span className="font-medium text-primary-600">
                      {Math.min(currentPage * organizationsPerPage, mockAnalyticsData.organizations.length)}
                    </span>{" "}
                    of <span className="font-medium text-primary-600">{mockAnalyticsData.organizations.length}</span> results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg bg-white text-sm font-medium text-slate-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-primary-100 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">Previous</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(mockAnalyticsData.organizations.length / organizationsPerPage), currentPage + 1))}
                      disabled={currentPage === Math.ceil(mockAnalyticsData.organizations.length / organizationsPerPage)}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-glow transition-all"
                    >
                      <span className="mr-1">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                Profile Performance
              </h2>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Overall Score
                  </span>
                  <span className="text-sm font-bold text-primary-600">
                    {mockAnalyticsData.performance.overall}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-primary h-3 rounded-full"
                    style={{
                      width: `${mockAnalyticsData.performance.overall}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Experience</span>
                    <span className="text-sm font-medium text-slate-900">
                      {mockAnalyticsData.performance.sections.experience}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${mockAnalyticsData.performance.sections.experience}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Education</span>
                    <span className="text-sm font-medium text-slate-900">
                      {mockAnalyticsData.performance.sections.education}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${mockAnalyticsData.performance.sections.education}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Skills</span>
                    <span className="text-sm font-medium text-slate-900">
                      {mockAnalyticsData.performance.sections.skills}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${mockAnalyticsData.performance.sections.skills}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Projects</span>
                    <span className="text-sm font-medium text-slate-900">
                      {mockAnalyticsData.performance.sections.projects}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${mockAnalyticsData.performance.sections.projects}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-800">
                  <span className="font-semibold">Pro Tip:</span> Adding
                  quantifiable achievements to your experience section can
                  improve your profile score by up to 12%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
