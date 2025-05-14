import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Book, Users, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import Loading from "../Components/Loading"
import AuthProtectedLink from '../Components/AuthLink';

export default function AboutPage() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/about');
        setPageData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load about page data');
        setLoading(false);
        console.error('Error fetching about page data:', err);
      }
    };

    fetchAboutData();
  }, []);

  const handleNavigateToProfile = (name) => {
    navigate(`/profile/${name.toLowerCase().replace(/ /g, '-')}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return null;
  }

  // Prepare team members with proper formatting
  const teamMembers = pageData.members || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Main text area */}
            <div className="md:w-1/2">
              <div className="text-5xl font-bold mb-10">
                <ReactMarkdown>{pageData.hero.title}</ReactMarkdown>
              </div>
              <div className="text-lg text-black/80 font-semibold mb-8">
                <ReactMarkdown>{pageData.hero.content}</ReactMarkdown>
              </div>
              <button onClick={() => navigate("/")}
                className="flex items-center bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition">
                Explore our journal <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Image area */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-6 gap-1 h-full">
                <div className="col-span-6 h-64">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Students collaborating"
                    className="w-full h-full object-cover rounded-t-lg" />
                </div>
                <div className="col-span-3 h-48">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Student writing"
                    className="w-full h-full object-cover rounded-bl-lg" />
                </div>
                <div className="col-span-3 h-48">
                  <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Students discussing"
                    className="w-full h-full object-cover rounded-br-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content sections in single column format */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Mission Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="mr-3 h-6 w-6 text-emerald-700" />
            Our Mission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {pageData.mission.map((item, index) => (
              <div key={index} className="bg-emerald-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  {index === 0 && <Book className="h-6 w-6 text-emerald-700" />}
                  {index === 1 && <Users className="h-6 w-6 text-emerald-700" />}
                  {index === 2 && <Briefcase className="h-6 w-6 text-emerald-700" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="text-gray-600">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        {pageData.founder && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Briefcase className="mr-3 h-6 w-6 text-emerald-700" />
              Founder
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-200 rounded-lg transform rotate-3"></div>
                  <img
                    src={pageData.founder.image}
                    alt={pageData.founder.name}
                    className="relative z-10 rounded-lg shadow-lg w-full h-96 object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageData.founder.name}</h3>
                <p className="text-emerald-700 font-medium text-lg mb-4">{pageData.founder.role}</p>
                <div className="prose max-w-none text-gray-600 text-lg">
                  <ReactMarkdown>{pageData.founder.bio}</ReactMarkdown>
                </div>
                <div className="mt-6">
                  <AuthProtectedLink
                    to={`/profile/${pageData.founder.user}`}
                    className="px-6 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
                    title="Join Our Community"
                    message="Please log in to view this author's profile and discover more of their content."

                  >
                    View Profile
                  </AuthProtectedLink>
                </div>
              </div>
            </div>

            {pageData.founder.message && (
              <div className="mt-12 bg-emerald-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">A Message From Our Founder</h3>
                <blockquote className="italic text-gray-600 border-l-4 border-emerald-300 pl-4">
                  <div className="italic text-gray-600">
                    <ReactMarkdown>{pageData.founder.message}</ReactMarkdown>
                  </div>
                </blockquote>
              </div>
            )}
          </div>
        )}

        {/* Team Section */}
        {teamMembers.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Users className="mr-3 h-6 w-6 text-emerald-700" />
              Our Team
            </h2>

            {/* Calculate the number of columns needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <AuthProtectedLink
                  to={`/profile/${member.user}`}
                  key={index}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg
                    ${teamMembers.length % 3 === 1 && index === teamMembers.length - 1 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
                  title="Join Our Community"
                  message="Please log in to view this author's profile and discover more of their content."
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-emerald-700 font-medium mb-2">{member.role}</p>
                  </div>
                </AuthProtectedLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}