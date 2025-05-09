import { useState } from 'react'
import { BookOpen, User, Menu, X, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Utils/context';
import axios from 'axios';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            navigate("/");
            window.location.reload(); // Force refresh to update auth state
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-emerald-600" />
                        <span className="ml-2 text-xl font-serif font-bold text-gray-900">Beyond The Margin</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-emerald-600 font-medium text-sm border-b-2 border-emerald-600 pb-1"
                                    : "text-gray-500 hover:text-emerald-600 text-sm font-medium"
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/articles"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-emerald-600 font-medium text-sm border-b-2 border-emerald-600 pb-1"
                                    : "text-gray-500 hover:text-emerald-600 text-sm font-medium"
                            }
                        >
                            Articles
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-emerald-600 font-medium text-sm border-b-2 border-emerald-600 pb-1"
                                    : "text-gray-500 hover:text-emerald-600 text-sm font-medium"
                            }
                        >
                            About Us
                        </NavLink>

                        {currentUser && (
                            <NavLink
                                to="/publish"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-emerald-600 font-medium text-sm border-b-2 border-emerald-600 pb-1"
                                        : "text-gray-500 hover:text-emerald-600 text-sm font-medium"
                                }
                            >
                                Publish
                            </NavLink>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                        {currentUser ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <div className="flex items-center max-w-64 line-clamp-1">
                                    <img
                                        src={currentUser.avatar || '/default-avatar.png'}
                                        alt="User avatar"
                                        className="h-8 w-8 rounded-full mr-2"
                                    />
                                    <span className="text-sm font-medium">Hello, <br /> {currentUser.fullname}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-600 px-4 py-2 rounded-full"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <NavLink
                                    to="/login"
                                    className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full"
                                >
                                    Get Started
                                </NavLink>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white pt-2 pb-3 border-t border-gray-200">
                    <div className="px-4 space-y-1">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-3 py-2 rounded-md text-base font-medium text-emerald-600 bg-emerald-50"
                                    : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/articles"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-3 py-2 rounded-md text-base font-medium text-emerald-600 bg-emerald-50"
                                    : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            Articles
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-3 py-2 rounded-md text-base font-medium text-emerald-600 bg-emerald-50"
                                    : "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }
                        >
                            About Us
                        </NavLink>

                        {currentUser && (
                            <NavLink
                                to="/publish"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-emerald-600 font-medium text-sm border-b-2 border-emerald-600 pb-1"
                                        : "text-gray-500 hover:text-emerald-600 text-sm font-medium"
                                }
                            >
                                Publish
                            </NavLink>
                        )}
                    </div>

                    <div className="px-4 pt-4 pb-3 border-t border-gray-200">
                        {currentUser ? (
                            <div>
                                <div className="flex items-center mb-3 cursor-pointer" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                                    <img
                                        src={currentUser.avatar || '/default-avatar.png'}
                                        alt="User avatar"
                                        className="h-10 w-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="text-base font-medium text-gray-800">Hello, {currentUser.fullname}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center text-base font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-3">
                                <div className="flex space-x-3">
                                    <NavLink
                                        to="/login"
                                        className="flex-1 flex items-center justify-center bg-white border border-emerald-600 text-emerald-600 px-4 py-2 rounded-full text-base font-medium"
                                    >
                                        Sign In
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        className="flex-1 flex items-center justify-center bg-emerald-600 text-white px-4 py-2 rounded-full text-base font-medium"
                                    >
                                        Get Started
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar