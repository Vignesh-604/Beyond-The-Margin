import { useState } from 'react';
import { Briefcase, Book, Users, ChevronRight, Linkedin, Twitter, Github } from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');
  
  const founder = {
    name: "Aadya Jain",
    role: "Founder & Editor-in-Chief",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Aadya is a high school student with a passion for advocacy, performing arts and creative expression. With an aim to add uniqueness to whatever she does, she strives to create a positive impact on society. With over 10 years of experience in classical dance, she has performed across the country with her group."
  };
  
  const teamMembers = [
    {
      name: "Rahul Sharma",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Rahul designed and developed the entire Beyond the Margin website. With expertise in React and modern web technologies, he ensures our platform reaches audiences effectively."
    },
    {
      name: "Priya Patel",
      role: "Content Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Priya oversees all content strategy and editorial processes. Her background in journalism helps maintain the high quality of our publications."
    },
    {
      name: "Arjun Mehta",
      role: "Political Science Editor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Arjun specializes in political theory and international relations, bringing academic rigor to our political science content."
    },
    {
      name: "Riya Kapoor",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Riya manages our visual identity and designs our print publications. Her artistic background brings a unique aesthetic to our journal."
    },
    {
      name: "Nikhil Verma",
      role: "Outreach Coordinator",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Nikhil builds partnerships with academic institutions and organizes events to expand our reach and impact."
    },
    {
      name: "Meera Shah",
      role: "Social Media Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Meera manages our social media presence, creating engaging content that highlights our journal's work and initiatives."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Grid Layout similar to Image 1 */}
      <div className="relative bg-black text-white">
        <div className="grid grid-cols-12 gap-1">
          {/* Main text area */}
          <div className="col-span-12 md:col-span-6 p-8 md:p-16 flex items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">We're changing the way people think</h1>
              <p className="text-lg text-gray-300 mb-8">
                Beyond the Margin is a student-founded, student-led initiative which aims to shed light on topics 
                that often go unnoticed, issues that are deeply significant but rarely discussed. This journal 
                explores ideas which are beyond the narrow boundaries of traditional learning, with a special 
                focus on Political Science and related interdisciplinary topics.
              </p>
              <button className="flex items-center bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition">
                Explore our journal <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Image grid area */}
          <div className="col-span-12 md:col-span-6 grid grid-cols-6 gap-1">
            <div className="col-span-6 h-64 bg-gray-800">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Students collaborating" 
                   className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 h-64 bg-gray-700">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Student writing" 
                   className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 h-64 bg-gray-900">
              <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Students discussing" 
                   className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex space-x-2 border-b border-gray-200 px-6 pt-4">
            <button 
              onClick={() => setActiveTab('mission')}
              className={`px-5 py-3 font-medium text-sm rounded-t-lg flex items-center ${
                activeTab === 'mission' 
                  ? 'text-emerald-700 border-b-2 border-emerald-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Book className="mr-2 h-4 w-4" />
              Our Mission
            </button>
            <button 
              onClick={() => setActiveTab('founder')}
              className={`px-5 py-3 font-medium text-sm rounded-t-lg flex items-center ${
                activeTab === 'founder' 
                  ? 'text-emerald-700 border-b-2 border-emerald-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Founder
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`px-5 py-3 font-medium text-sm rounded-t-lg flex items-center ${
                activeTab === 'team' 
                  ? 'text-emerald-700 border-b-2 border-emerald-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Our Team
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'mission' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                    <p className="text-gray-600 mb-4">
                      <span className="text-emerald-700 font-semibold">Beyond the Margin</span> is a student-founded, student-led initiative which aims to shed light on topics that often go unnoticed, issues that are deeply significant but rarely discussed.
                    </p>
                    <p className="text-gray-600 mb-4">
                      This journal explores ideas which are beyond the narrow boundaries of traditional learning, with a special focus on Political Science and related interdisciplinary topics.
                    </p>
                    <p className="text-gray-600">
                      We believe in the power of student voices and provide a platform for original perspectives, critical analyses, and innovative ideas that might otherwise remain in the margins of academic discourse.
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Students collaborating" 
                      className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-emerald-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Book className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Amplify Student Voices</h3>
                    <p className="text-gray-600">We create a platform where students can express their perspectives on complex political and social issues.</p>
                  </div>
                  
                  <div className="bg-emerald-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore the Unexplored</h3>
                    <p className="text-gray-600">We delve into topics that fall outside conventional academic discussions but are crucial to understanding our world.</p>
                  </div>
                  
                  <div className="bg-emerald-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Bridge Disciplines</h3>
                    <p className="text-gray-600">We embrace interdisciplinary approaches, connecting political science with other fields for a more holistic understanding.</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'founder' && (
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="md:w-1/3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-200 rounded-lg transform rotate-3"></div>
                      <img 
                        src={founder.image} 
                        alt={founder.name} 
                        className="relative z-10 rounded-lg shadow-lg w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{founder.name}</h2>
                    <p className="text-emerald-700 font-medium text-lg mb-4">{founder.role}</p>
                    <div className="prose max-w-none text-gray-600">
                      <p>{founder.bio}</p>
                      <p className="mt-4">
                        Driven by a passion for creating spaces where important conversations can happen, Aadya founded Beyond the Margin to bridge the gap between academic knowledge and real-world issues. She believes in the power of student perspectives to shape new paradigms of understanding.
                      </p>
                      <div className="mt-6 flex space-x-4">
                        <button className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition flex items-center">
                          <Linkedin className="mr-2 h-4 w-4" /> Connect on LinkedIn
                        </button>
                        <button className="px-4 py-2 border border-emerald-700 text-emerald-700 rounded-md hover:bg-emerald-50 transition">
                          Read Articles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 bg-emerald-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">A Message From Our Founder</h3>
                  <blockquote className="italic text-gray-600 border-l-4 border-emerald-300 pl-4">
                    "Beyond the Margin was born out of a desire to create a platform where students could engage with ideas often left unexplored in traditional education. I believe that the perspectives of young minds can offer fresh insights into complex political and social issues. Our journal aims to be a bridge between academic rigor and lived experiences, providing a space for diverse voices to be heard and celebrated."
                  </blockquote>
                </div>
              </div>
            )}
            
            {activeTab === 'team' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Behind Beyond the Margin is a passionate team of students dedicated to exploring ideas beyond conventional boundaries. Together, we bring diverse perspectives and skills to create a platform for thoughtful discourse.
                  </p>
                </div>
                
                {/* Team grid similar to Image 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-64 object-cover object-center"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                        <p className="text-emerald-700 font-medium mb-2">{member.role}</p>
                        <p className="text-gray-600 text-sm">{member.bio}</p>
                        <div className="mt-4 flex space-x-2">
                          <button className="p-2 text-gray-500 hover:text-emerald-700">
                            <Linkedin className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-emerald-700">
                            <Twitter className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-emerald-700">
                            <Github className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-16 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    Are you passionate about exploring ideas beyond traditional boundaries? We're always looking for dedicated students to join our team.
                  </p>
                  <button className="px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition">
                    Apply to Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>      
    </div>
  );
}