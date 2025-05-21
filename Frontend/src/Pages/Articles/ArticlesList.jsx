import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { TrendingArticleCard } from '../../Components/ArticleCards'
import { category } from '../../Utils/data';
import Loading from '../../Components/Loading';


export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalArticles: 0,
    articlesInPage: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCats()
    fetchArticles();
  }, [selectedCategory, selectedSubcategory, currentPage]);

  const fetchCats = async () => {
    const categoryData = await category();
    setCategories(categoryData);
  }

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  useEffect(() => {
    // Update available subcategories when category changes
    if (selectedCategory) {
      const category = categories.find(cat => cat.category === selectedCategory);
      setAvailableSubcategories(category ? category.subcategories : []);
      setSelectedSubcategory(''); // Reset subcategory when category changes
    } else {
      setAvailableSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (selectedSubcategory) {
        params.append('subcategory', selectedSubcategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      params.append('page', currentPage);
      params.append('limit', 9);
      params.append('sort', 'newest');

      const response = await axios.get(`/api/articles/search?${params.toString()}`);
      const { articles, pagination } = response.data.data || { articles: [], pagination: {} };
      
      setArticles(articles);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const filteredArticles = articles || []

  if (loading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button type="submit" className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        {/* Category Dropdown */}
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.category}>{cat.category}</option>
            ))}
          </select>
        </div>
        
        {/* Subcategory Dropdown */}
        <div className="w-full md:w-64">
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory}
            className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map((subcat, index) => (
              <option key={index} value={subcat}>{subcat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Filter Pills */}
      {(selectedCategory || searchTerm) && (
        <div className="flex flex-wrap gap-2 mb-6 -mt-4">
          {selectedCategory && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full flex items-center">
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory('')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedSubcategory && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full flex items-center">
              {selectedSubcategory}
              <button 
                onClick={() => setSelectedSubcategory('')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full flex items-center">
              Search: {searchTerm}
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
      
      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredArticles.map((article) => (
            <TrendingArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Load More / Pagination */}
      {filteredArticles.length > 0 && (
        <div className="flex flex-col items-center mt-12 space-y-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevPage}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-800 font-semibold">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <span className="text-xs text-gray-900">
            Showing {pagination.articlesInPage} of {pagination.totalArticles} articles
          </span>
        </div>
      )}
    </div>
  );
}