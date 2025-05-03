import React from 'react'
import { BookOpen } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="ml-2 text-lg font-serif font-bold text-gray-900">Beyond The Margin</span>
          </div>
          <p className="mt-4 text-gray-600 max-w-md">
            A platform dedicated to thoughtful journalism, in-depth analysis, and meaningful conversations.
            We believe in the power of words to inspire change and foster understanding.
          </p>
          <div className="mt-6 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-emerald-600">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-600">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-600">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-600">
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Explore</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Home</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Discover</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Writers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Categories</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Community</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">About Us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Our Mission</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Contact Us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-emerald-600">Submit Article</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          © 2025 Beyond The Margin. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 flex space-x-8">
          <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-emerald-600">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer