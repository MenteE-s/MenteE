import React, { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Briefcase,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { API_BASE } from "../../config";

const Organizations = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user from local storage
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (err) {
          console.error("Error parsing user data from localStorage:", err);
        }

        // Fetch organizations from API
        const response = await fetch(`${API_BASE}/organizations`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
        } else {
          setError("Failed to load organizations");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter organizations based on search term and industry
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      filterIndustry === "all" || org.industry === filterIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter dropdown
  const industries = [
    "all",
    ...new Set(organizations.map((org) => org.industry).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading organizations...</p>
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
            Organizations
          </h1>
          <p className="text-slate-600">
            Discover which organizations are viewing your profile
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry === "all" ? "All Industries" : industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {org.profile_image ? (
                      <img
                        src={org.profile_image}
                        alt={org.name}
                        className="h-12 w-12 rounded-lg object-contain mr-3"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                        <Building className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {org.name}
                      </h3>
                      <div className="flex items-center text-sm text-slate-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {org.industry || "Industry not specified"}
                      </div>
                    </div>
                  </div>
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {org.description || "No description available."}
                </p>

                {org.location && (
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {org.location}
                  </div>
                )}

                {org.company_size && (
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Building className="h-4 w-4 mr-1" />
                    {org.company_size} employees
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-slate-500">
                  Founded:{" "}
                  {org.created_at
                    ? new Date(org.created_at).toLocaleDateString()
                    : "Date not available"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No organizations found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
