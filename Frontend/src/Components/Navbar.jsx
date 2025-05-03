import { useState } from 'react'
import { Search, BookOpen, User, Menu, X, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <a href="#" className="text-gray-900 hover:text-emerald-600 text-sm font-medium">Home</a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 text-sm font-medium">Discover</a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 text-sm font-medium">Writers</a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 text-sm font-medium">About Us</a>

          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
              </div>
            </div>

            <button className="hidden md:flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-600 hover:border-emerald-800 px-4 py-2 rounded-full">
              Sign In
            </button>

            <button className="hidden md:flex items-center text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full">
              Get Started
            </button>

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
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50">Home</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Discover</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Writers</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">About Us</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Submit Article</a>
          </div>
          <div className="px-4 pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Guest</div>
                <div className="text-sm font-medium text-gray-500">Join our community</div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-base w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 bg-white border border-emerald-600 text-emerald-600 px-4 py-2 rounded-full text-base font-medium">
                  Sign In
                </button>
                <button className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-full text-base font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar