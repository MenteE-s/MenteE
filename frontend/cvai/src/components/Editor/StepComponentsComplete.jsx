import React, { useState } from "react";
import { Plus, X, Code, FolderOpen } from "lucide-react";

// Form components
const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  onKeyDown,
}) => (
  <div className={`mb-4 ${className}`}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
    />
  </div>
);

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
}) => (
  <div className={`mb-4 ${className}`}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
    />
  </div>
);

// Step 5: Skills
export const Step5_Skills = ({ data, setCvData }) => {
  const [currentSkill, setCurrentSkill] = useState("");
  const [addedSkill, setAddedSkill] = useState(null);
  const [skillSuggestions] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "REST API",
    "GraphQL",
    "Machine Learning",
    "Data Analysis",
  ]);

  const addSkill = () => {
    if (currentSkill.trim() && !data.includes(currentSkill.trim())) {
      const skill = currentSkill.trim();
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setAddedSkill(skill);
      setCurrentSkill("");
      setTimeout(() => setAddedSkill(null), 2000); // Clear feedback after 2s
    }
  };

  const removeSkill = (skillToRemove) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const selectSuggestion = (skill) => {
    setCurrentSkill(skill);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Skills</h3>
          <p className="text-slate-600">
            List your technical and soft skills. This is a critical section for
            recruiters.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <FormInput
            label="Add a Skill"
            name="skillInput"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., JavaScript"
            className="flex-1"
          />
          <button
            onClick={addSkill}
            disabled={
              !currentSkill.trim() || data.includes(currentSkill.trim())
            }
            className="px-6 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all self-end h-[46px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Add skill"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {addedSkill && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm animate-fade-in">
            ✓ "{addedSkill}" has been added to your skills!
          </div>
        )}

        {/* Skill suggestions */}
        {currentSkill === "" && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Popular skills:</p>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => selectSuggestion(skill)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm hover:bg-primary-100 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 rounded-lg min-h-[100px] border border-slate-200">
        {data.length === 0 ? (
          <div className="text-center py-4">
            <Code className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">
              No skills added yet. Add your key skills above.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {data.map((skill, index) => (
              <span
                key={skill}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-medium text-sm shadow-sm hover:shadow-md transition-all animate-fade-in"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-white hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 rounded"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Step 6: Projects
export const Step6_Projects = ({ data, setCvData }) => {
  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      link: "",
      technologies: [],
    };
    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (id) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;

    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => {
        if (item.id === id) {
          if (name === "technologies") {
            return {
              ...item,
              [name]: value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            };
          }
          return { ...item, [name]: value };
        }
        return item;
      }),
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
            <FolderOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Projects</h3>
            <p className="text-slate-600">
              Showcase your best work. Link to your GitHub repos or live demos.
            </p>
          </div>
        </div>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm font-medium transition-all flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Add new project"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">
            No projects added yet.
          </h4>
          <p className="text-slate-500">
            Click "Add Project" button to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="p-6 border border-slate-200 rounded-lg relative hover:border-primary-300 transition-all animate-fade-in"
            >
              <button
                onClick={() => removeProject(item.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Remove project"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Project Title"
                  id={`title-${item.id}`}
                  name="title"
                  value={item.title}
                  onChange={(e) => handleChange(e, item.id)}
                  placeholder="e.g., AI Resume Builder"
                />
                <FormInput
                  label="Project Link"
                  id={`link-${item.id}`}
                  name="link"
                  value={item.link}
                  onChange={(e) => handleChange(e, item.id)}
                  placeholder="e.g., github.com/user/repo"
                />
                <FormInput
                  label="Technologies Used (comma-separated)"
                  id={`tech-${item.id}`}
                  name="technologies"
                  value={item.technologies.join(", ")}
                  onChange={(e) => handleChange(e, item.id)}
                  placeholder="e.g., React, Node.js, Firebase"
                  className="md:col-span-2"
                />
                <FormTextarea
                  label="Project Description"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, item.id)}
                  rows={4}
                  placeholder="Briefly describe the project, its purpose, and your role. Highlight key achievements and metrics where possible."
                  className="md:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditorComponents = {
  FormInput,
  FormTextarea,
  Step5_Skills,
  Step6_Projects,
};

export default EditorComponents;
