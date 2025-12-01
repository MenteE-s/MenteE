
import React, { useState, useEffect } from "react";
import { Search, Briefcase, MapPin, Clock, Building, ExternalLink, Filter } from "lucide-react";

const Jobs = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterRemote, setFilterRemote] = useState("all");
  const [savedJobs, setSavedJobs] = useState([]);

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

  // Mock data for job listings
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Google",
      logo: "https://logo.clearbit.com/google.com",
      location: "Mountain View, CA",
      type: "Full-time",
      remote: "Remote",
      posted: "2 days ago",
      description: "We're looking for an experienced Frontend Developer to join our team and help build the future of our products.",
      skills: ["React", "TypeScript", "CSS", "UI/UX"],
      salary: "$150k - $200k",
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Meta",
      logo: "https://logo.clearbit.com/meta.com",
      location: "Menlo Park, CA",
      type: "Full-time",
      remote: "Hybrid",
      posted: "3 days ago",
      description: "Join our design team to create intuitive and beautiful experiences for billions of users.",
      skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
      salary: "$130k - $180k",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      location: "Seattle, WA",
      type: "Full-time",
      remote: "Remote",
      posted: "1 week ago",
      description: "We're seeking a Backend Engineer to help scale our infrastructure and services.",
      skills: ["Node.js", "AWS", "Databases", "Microservices"],
      salary: "$140k - $190k",
    },
    {
      id: 4,
      title: "UX Researcher",
      company: "Apple",
      logo: "https://logo.clearbit.com/apple.com",
      location: "Cupertino, CA",
      type: "Full-time",
      remote: "On-site",
      posted: "4 days ago",
      description: "Help us understand user needs and behaviors to inform product development.",
      skills: ["User Research", "Data Analysis", "Prototyping", "Presentation"],
      salary: "$120k - $160k",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "Microsoft",
      logo: "https://logo.clearbit.com/microsoft.com",
      location: "Redmond, WA",
      type: "Full-time",
      remote: "Remote",
      posted: "5 days ago",
      description: "Join our team to build and maintain scalable infrastructure for our cloud services.",
      skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
      salary: "$145k - $195k",
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "Netflix",
      logo: "https://logo.clearbit.com/netflix.com",
      location: "Los Gatos, CA",
      type: "Full-time",
      remote: "Remote",
      posted: "1 week ago",
      description: "Help us analyze data to improve our content recommendation algorithms.",
      skills: ["Python", "Machine Learning", "Statistics", "Data Visualization"],
      salary: "$135k - $185k",
    },
  ];

  // Filter jobs based on search term and filters
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = filterLocation === "all" || job.location.includes(filterLocation);
    const matchesType = filterType === "all" || job.type === filterType;
    const matchesRemote = filterRemote === "all" || job.remote === filterRemote;

    return matchesSearch && matchesLocation && matchesType && matchesRemote;
  });

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Get unique locations for filter dropdown
  const locations = ["all", "California", "Washington", "Remote"];
  const types = ["all", "Full-time", "Part-time", "Contract", "Internship"];
  const remoteOptions = ["all", "Remote", "Hybrid", "On-site"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Job Opportunities
          </h1>
          <p className="text-slate-600">
            Discover job opportunities that match your skills and experience
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <select
                  value={filterRemote}
                  onChange={(e) => setFilterRemote(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {remoteOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all" ? "All Work Types" : option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="h-12 w-12 rounded-lg object-contain mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <div className="flex items-center text-sm text-slate-500">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-lg ${savedJobs.includes(job.id) ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                  <span className="mx-2">•</span>
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.type}
                  <span className="mx-2">•</span>
                  {job.remote}
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm font-medium text-primary-600">
                    {job.salary}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {job.posted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-8 text-center">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
