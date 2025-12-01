
import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Building, User, Video, Phone, CheckCircle, XCircle, Search, Filter } from "lucide-react";

const Interviews = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

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

  // Mock data for interviews
  const mockInterviews = [
    {
      id: 1,
      company: "TechCorp Solutions",
      logo: "https://picsum.photos/seed/techcorp/200/200.jpg",
      position: "Senior Frontend Developer",
      type: "Video Interview",
      date: "2023-11-15",
      time: "10:00 AM",
      duration: "45 minutes",
      status: "upcoming",
      interviewer: "Sarah Johnson",
      location: "Zoom Meeting",
      description: "Technical interview focused on React and JavaScript skills.",
      notes: "Prepare portfolio and be ready to discuss recent projects.",
    },
    {
      id: 2,
      company: "Global Finance Inc",
      logo: "https://picsum.photos/seed/globalfinance/200/200.jpg",
      position: "Product Designer",
      type: "Phone Interview",
      date: "2023-11-18",
      time: "2:00 PM",
      duration: "30 minutes",
      status: "upcoming",
      interviewer: "Michael Chen",
      location: "Phone Call",
      description: "Initial screening interview to discuss your design experience.",
      notes: "Have portfolio link ready to share.",
    },
    {
      id: 3,
      company: "Healthcare Plus",
      logo: "https://picsum.photos/seed/healthcare/200/200.jpg",
      position: "UX Researcher",
      type: "In-Person Interview",
      date: "2023-11-10",
      time: "11:00 AM",
      duration: "1 hour",
      status: "completed",
      interviewer: "Emily Rodriguez",
      location: "123 Main St, Boston, MA",
      description: "On-site interview with the design team and stakeholders.",
      notes: "Bring printed portfolio and references.",
    },
    {
      id: 4,
      company: "Creative Agency",
      logo: "https://picsum.photos/seed/creative/200/200.jpg",
      position: "Marketing Specialist",
      type: "Video Interview",
      date: "2023-11-12",
      time: "3:00 PM",
      duration: "45 minutes",
      status: "cancelled",
      interviewer: "David Wilson",
      location: "Google Meet",
      description: "Interview cancelled by the company due to scheduling conflicts.",
      notes: "Company will reach out to reschedule.",
    },
    {
      id: 5,
      company: "EduTech Innovations",
      logo: "https://picsum.photos/seed/edutech/200/200.jpg",
      position: "Content Developer",
      type: "Video Interview",
      date: "2023-11-20",
      time: "1:00 PM",
      duration: "1 hour",
      status: "upcoming",
      interviewer: "Lisa Anderson",
      location: "Microsoft Teams",
      description: "Interview to discuss your experience in educational content creation.",
      notes: "Prepare examples of previous educational content.",
    },
  ];

  // Filter interviews based on search term and filters
  const filteredInterviews = mockInterviews.filter(interview => {
    const matchesSearch = 
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || interview.status === filterStatus;
    const matchesType = filterType === "all" || interview.type.includes(filterType);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "upcoming":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get interview type icon
  const getTypeIcon = (type) => {
    if (type.includes("Video")) {
      return <Video className="h-5 w-5 text-slate-500" />;
    } else if (type.includes("Phone")) {
      return <Phone className="h-5 w-5 text-slate-500" />;
    } else {
      return <MapPin className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Invitations</h1>
        <p className="text-slate-600">Manage your upcoming and past interviews</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search interviews..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400 h-5 w-5" />
              <select
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Video">Video</option>
                <option value="Phone">Phone</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <img 
                      src={interview.logo} 
                      alt={`${interview.company} logo`}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800">{interview.position}</h3>
                      <div className="flex items-center text-slate-600 mb-1">
                        <Building className="h-4 w-4 mr-1" />
                        {interview.company}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <User className="h-4 w-4 mr-1" />
                        Interviewer: {interview.interviewer}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusIcon(interview.status)}
                    <span className="text-sm font-medium text-slate-500 mt-1 capitalize">
                      {interview.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {interview.date}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {interview.time} ({interview.duration})
                  </div>
                  <div className="flex items-center text-slate-600">
                    {getTypeIcon(interview.type)}
                    <span className="ml-2">{interview.type}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-600">{interview.description}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-1">Notes:</p>
                  <p className="text-sm text-slate-600">{interview.notes}</p>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm text-slate-500">
                    {interview.type.includes("Video") && (
                      <span>Meeting link will be sent via email</span>
                    )}
                    {interview.type.includes("Phone") && (
                      <span>Interviewer will call you at the scheduled time</span>
                    )}
                    {interview.type.includes("In-Person") && (
                      <span>Location: {interview.location}</span>
                    )}
                  </div>
                  {interview.status === "upcoming" && (
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredInterviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-slate-500">No interviews found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Interviews;
