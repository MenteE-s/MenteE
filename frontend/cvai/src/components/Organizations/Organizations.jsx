
import React, { useState, useEffect } from "react";
import { Building, MapPin, Briefcase, ExternalLink, Search, Filter } from "lucide-react";

const Organizations = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");

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

  // Mock data for organizations
  const mockOrganizations = [
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
      website: "https://google.com",
      description: "Multinational technology company specializing in Internet-related services and products.",
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
      website: "https://microsoft.com",
      description: "Technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and personal computers.",
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
      website: "https://amazon.com",
      description: "Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
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
      website: "https://meta.com",
      description: "Technology conglomerate that builds technologies that help people connect and share.",
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
      website: "https://apple.com",
      description: "Multinational technology company that specializes in consumer electronics, computer software, and online services.",
    },
    {
      id: 6,
      name: "Netflix",
      logo: "https://logo.clearbit.com/netflix.com",
      views: 58,
      shares: 12,
      downloads: 6,
      industry: "Entertainment",
      location: "Los Gatos, CA",
      lastViewed: "2023-11-05",
      website: "https://netflix.com",
      description: "Subscription streaming service and production company.",
    },
    {
      id: 7,
      name: "Tesla",
      logo: "https://logo.clearbit.com/tesla.com",
      views: 52,
      shares: 11,
      downloads: 5,
      industry: "Automotive",
      location: "Palo Alto, CA",
      lastViewed: "2023-11-04",
      website: "https://tesla.com",
      description: "Electric vehicle and clean energy company.",
    },
    {
      id: 8,
      name: "Spotify",
      logo: "https://logo.clearbit.com/spotify.com",
      views: 47,
      shares: 9,
      downloads: 4,
      industry: "Entertainment",
      location: "Stockholm, Sweden",
      lastViewed: "2023-11-03",
      website: "https://spotify.com",
      description: "Audio streaming and media services provider.",
    },
  ];

  // Filter organizations based on search term and industry
  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = filterIndustry === "all" || org.industry === filterIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter dropdown
  const industries = ["all", ...new Set(mockOrganizations.map(org => org.industry))];

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
            <div key={org.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="h-12 w-12 rounded-lg object-contain mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
                      <div className="flex items-center text-sm text-slate-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {org.industry}
                      </div>
                    </div>
                  </div>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {org.description}
                </p>

                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {org.location}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-semibold text-slate-900">{org.views}</div>
                    <div className="text-xs text-slate-500">Views</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-semibold text-slate-900">{org.shares}</div>
                    <div className="text-xs text-slate-500">Shares</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-semibold text-slate-900">{org.downloads}</div>
                    <div className="text-xs text-slate-500">Downloads</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-slate-500">
                  Last viewed: {new Date(org.lastViewed).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No organizations found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
