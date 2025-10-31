import CallToAction from '../components/CallToAction';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaRocket, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function About() {
  const teamMembers = [
    {
      name: "ဘားအံ",
      role: "Founder & Writer",
      bio: "Passionate about sharing knowledge and experiences through writing.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const stats = [
    { number: "100+", label: "Articles Published", icon: FaRocket },
    { number: "50K+", label: "Readers Reached", icon: FaUsers },
    { number: "95%", label: "Satisfaction Rate", icon: FaHeart },
    { number: "24/7", label: "Content Updates", icon: FaLightbulb }
  ];

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
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ဘားအံ's Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Where passion meets purpose, and stories come to life through words that inspire and connect.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
                  alt="About our blog"
                  className="relative rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMjAwTDM1MCAyNTBMMzAwIDMwMEwyNTAgMjUwTDMwMCAyMDBaIiBmaWxsPSIjOTlBM0FGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIwMCIgcj0iMTAiIGZpbGw9IiM2QjczODAiLz4KPHRleHQgeD0iMzAwIiB5PSIzNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZCNzM4MCI+QmFyIEFuJ3MgQmxvZzwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Our Story & Mission
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  Welcome to <span className="font-semibold text-blue-600 dark:text-blue-400">ဘားအံ's Blog</span> - a digital sanctuary where curiosity meets creativity, and every word is crafted with purpose and passion.
                </p>
                <p>
                  We believe in the transformative power of storytelling and the magic that happens when diverse perspectives converge. Our platform is more than just a blog; it's a community of thinkers, dreamers, and doers who believe in the power of shared knowledge.
                </p>
                <p>
                  Through carefully curated content, we aim to inspire, educate, and connect people across the globe, fostering a space where ideas can flourish and conversations can thrive.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  📚 Education
                </span>
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  💡 Innovation
                </span>
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                  🌍 Community
                </span>
                <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                  ✨ Inspiration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Measuring success through meaningful engagement and community growth
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Creator
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              The passionate mind behind every word and the vision driving our community forward
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 shadow-lg max-w-md w-full transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
                  <img
                    src={teamMembers[0].image}
                    alt={teamMembers[0].name}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 mx-auto"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA1IDQ1IDkwIDc1IDkwUzEyMCAxMDUgMTIwIDEyMFYxNTBIMzBWMTIwWiIgZmlsbD0iIzlBQTNBQiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {teamMembers[0].name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  {teamMembers[0].role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {teamMembers[0].bio}
                </p>
                
                <div className="flex justify-center space-x-4">
                  <a href={teamMembers[0].social.github} className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a href={teamMembers[0].social.linkedin} className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href={teamMembers[0].social.twitter} className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href="mailto:contact@example.com" className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                    <FaEnvelope className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description: "We believe in genuine storytelling and authentic voices that resonate with real experiences and emotions.",
                icon: "💎"
              },
              {
                title: "Excellence",
                description: "Every piece of content is crafted with meticulous attention to detail and a commitment to quality.",
                icon: "⭐"
              },
              {
                title: "Community",
                description: "We foster a supportive environment where readers and writers can connect, share, and grow together.",
                icon: "🤝"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
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