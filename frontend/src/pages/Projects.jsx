import CallToAction from '../components/CallToAction';
import { FaCode, FaPalette, FaMobile, FaRocket, FaUsers, FaLightbulb, FaGithub, FaExternalLinkAlt, FaStar, FaClock } from 'react-icons/fa';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Interactive Portfolio Website",
      description: "A modern, responsive portfolio with smooth animations and dark mode support.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      difficulty: "Intermediate",
      duration: "2 weeks",
      githubUrl: "#",
      liveUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "E-commerce Dashboard",
      description: "Complete admin dashboard with analytics, product management, and order tracking.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      technologies: ["Next.js", "TypeScript", "Chart.js"],
      difficulty: "Advanced",
      duration: "4 weeks",
      githubUrl: "#",
      liveUrl: "#",
      featured: false
    },
    {
      id: 3,
      title: "Weather App",
      description: "Beautiful weather application with location detection and 7-day forecasts.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      technologies: ["JavaScript", "API Integration", "CSS3"],
      difficulty: "Beginner",
      duration: "1 week",
      githubUrl: "#",
      liveUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "Task Management App",
      description: "Productivity app with drag-and-drop functionality and real-time updates.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      difficulty: "Intermediate",
      duration: "3 weeks",
      githubUrl: "#",
      liveUrl: "#",
      featured: true
    }
  ];

  const features = [
    {
      icon: FaCode,
      title: "Hands-on Learning",
      description: "Learn by doing with real-world projects that challenge your skills"
    },
    {
      icon: FaPalette,
      title: "Creative Freedom",
      description: "Express your creativity while building beautiful, functional applications"
    },
    {
      icon: FaMobile,
      title: "Responsive Design",
      description: "Master the art of creating websites that work perfectly on all devices"
    },
    {
      icon: FaRocket,
      title: "Career Ready",
      description: "Build a portfolio that impresses employers and showcases your talent"
    }
  ];

  const learningPaths = [
    {
      level: "Beginner",
      projects: 8,
      skills: ["HTML5", "CSS3", "Basic JavaScript", "Responsive Design"],
      color: "from-green-500 to-emerald-600"
    },
    {
      level: "Intermediate",
      projects: 12,
      skills: ["React", "APIs", "State Management", "UI/UX Principles"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      level: "Advanced",
      projects: 6,
      skills: ["Full Stack", "Databases", "Authentication", "Deployment"],
      color: "from-purple-500 to-pink-600"
    }
  ];

  // SVG placeholder for project images
  const projectPlaceholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTUwIDEzMEwxMDAgMTgwTDUwIDEzMEwxMDAgODBaIiBmaWxsPSIjOTlBM0FGIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI4IiBmaWxsPSIjNkI3MzgwIi8+CjxwYXRoIGQ9Ik0zMDAgMTAwTDM1MCAxNTBMMzAwIDIwMEwyNTAgMTUwTDMwMCAxMDBaIiBmaWxsPSIjOTlBM0FGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEwMCIgcj0iOCIgZmlsbD0iIzZCNzM4MCIvPgo8dGV4dCB4PSIyMDAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MzgwIj5Qcm9qZWN0IFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo=';

  const handleImageError = (e) => {
    e.target.src = projectPlaceholderSVG;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Explore <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Projects</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dive into a curated collection of innovative projects designed to transform your coding skills from beginner to expert level.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-8"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Hand-picked projects that showcase the best of modern web development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(project => project.featured).map((project) => (
              <div key={project.id} className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <FaStar className="w-3 h-3" />
                    Featured
                  </span>
                </div>
                
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      project.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <FaClock className="w-3 h-3" />
                      {project.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={project.githubUrl}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-300"
                    >
                      <FaGithub className="w-4 h-4" />
                      Code
                    </a>
                    <a
                      href={project.liveUrl}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Projects Grid */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              All Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        project.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {project.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.duration}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Structured progression from fundamentals to advanced concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <FaLightbulb className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {path.level}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {path.projects} Projects
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Skills You'll Master:</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Start {path.level} Path
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Build Projects?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Building projects is the most effective way to learn programming. It transforms theoretical knowledge into practical skills, 
                  teaches you how to solve real-world problems, and helps you create an impressive portfolio that stands out to employers and clients alike.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What You'll Achieve
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Master modern web development technologies and frameworks
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Develop problem-solving skills through hands-on challenges
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Build a professional portfolio that showcases your capabilities
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Gain confidence in your ability to create real applications
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Learning Outcomes
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                    </div>
                    Clean, semantic HTML structure and best practices
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                    </div>
                    Advanced CSS techniques and responsive design principles
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                    </div>
                    JavaScript interactivity and modern ES6+ features
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
                    </div>
                    Debugging techniques and problem-solving strategies
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
                    </div>
                    Accessibility standards and performance optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <CallToAction />
          </div>
        </div>
      </section>
    </div>
  );
}