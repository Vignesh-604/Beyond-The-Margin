import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Utils/context';
import AuthProtectedLink from './AuthLink';
import logo from "../Assets/Logo.png"
import axios from 'axios';

function Footer() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center">
              <img src={logo} className="h-12 w-12 text-emerald-600" alt="Beyond The Margin" />
              <span className="ml-2 text-lg font-serif font-bold text-gray-900">Beyond The Margin</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              A platform dedicated to thoughtful journalism, in-depth analysis, and meaningful conversations.
            </p>
          </div>

          {/* Navigation links - using the same as navbar */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Navigation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <ul className="space-y-3">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-emerald-600 font-medium"
                          : "text-gray-600 hover:text-emerald-600"
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/articles"
                      className={({ isActive }) =>
                        isActive
                          ? "text-emerald-600 font-medium"
                          : "text-gray-600 hover:text-emerald-600"
                      }
                    >
                      Articles
                    </NavLink>
                  </li>

                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive
                          ? "text-emerald-600 font-medium"
                          : "text-gray-600 hover:text-emerald-600"
                      }
                    >
                      About Us
                    </NavLink>
                  </li>
                  {currentUser && (
                    <li>
                      <NavLink
                        to="/publish"
                        className={({ isActive }) =>
                          isActive
                            ? "text-emerald-600 font-medium"
                            : "text-gray-600 hover:text-emerald-600"
                        }
                      >
                        Publish
                      </NavLink>
                    </li>
                  )}
                  {!currentUser && (
                    <li>
                      <AuthProtectedLink
                        to="/"
                        className="text-gray-600 hover:text-emerald-600"
                        title="Join Our Community"
                        message="Please log in to view this author's profile and discover more of their content."
                      >
                        Get Started
                      </AuthProtectedLink>
                    </li>
                  )}
                </ul>
              </div>
              {currentUser && (
                <div>
                  <ul className="space-y-3">
                    <li>
                      <div
                        className="text-gray-600 hover:text-emerald-600 cursor-pointer"
                        onClick={() => navigate(`/profile/${currentUser?._id}`)}
                      >
                        My Profile
                      </div>
                    </li>
                    <li>
                      <div
                        className="text-gray-600 hover:text-emerald-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer