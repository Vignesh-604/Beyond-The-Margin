import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { TrendingArticleCard, ExploreArticleCard, FeaturedArticlesGrid } from '../Components/ArticleCards';
import axios from "axios"
import { dateFormat } from '../Utils/utils';
import Loading from '../Components/Loading';
import { Link } from 'react-router-dom';
import { category } from '../Utils/data';
import AuthProtectedLink from '../Components/AuthLink';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trending, setTrending] = useState([])
  const [explore, setExplore] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCats()
    axios.get(`/api/articles/trending`)
      .then(res => {
        const data = res.data.data
        setTrending(data)
        setLoading(false)
      })
      .catch(e => {
        console.log(e);
        // setLoading(false)
      })
  }, [])

  const fetchCats = async () => {
    const categoryData = await category();
    setCategories(categoryData);
  }
  
  useEffect(() => {
    axios.get(`/api/articles/filtered?filter=${selectedCategory}`)
      .then(res => {
        const data = res.data.data
        setExplore(data)
        setLoading(false)
      })
      .catch(e => {
        console.log(e);
        // setLoading(false)
      })
  }, [selectedCategory])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main>
        {/* Hero featured article */}
        {/* Hero featured article - Modified for better responsiveness */}
        <section className="py-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-wrap items-center text-xs sm:text-sm gap-2">
                  <span className="uppercase tracking-wider font-medium bg-emerald-600 rounded-lg px-2 py-1 text-white text-xs">Featured Story</span>
                  <div className="flex items-center flex-wrap">
                    <span className="uppercase tracking-wider font-medium text-emerald-600">{trending[0]?.category}</span>
                    <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
                    <span className="uppercase tracking-wider font-medium text-emerald-600 hidden sm:inline">{trending[0]?.subCategory}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500">{dateFormat(trending[0]?.createdAt)}</span>
                  </div>
                </div>

                <Link to={`/articles/${trending[0]?._id}`} className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 hover:text-emerald-600 leading-tight">
                  {trending[0]?.title}
                </Link>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  {trending[0]?.subtitle}
                </p>

                <div className="flex items-center justify-between pt-3 border-t">
                  <AuthProtectedLink
                    to={`/profile/${trending[0]?.user?._id}`}
                    className="flex items-center gap-2"
                    title="Join Our Community"
                    message="Please log in to view this author's profile and discover more of their content."
                  >
                    <img
                      src={trending[0]?.user.avatar}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium" />

                    <p className="text-xs sm:text-sm font-medium text-gray-900">{trending[0]?.user.fullname}</p>
                  </AuthProtectedLink>

                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {trending[0]?.readTime} min read
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending now */}
        <section className="py-4 border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Trending Now</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trending.slice(1).map(article => (
                <TrendingArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories and articles */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories filter */}
            <div className="mb-8 overflow-x-auto">
              <div className="inline-flex space-x-2 pb-2 overflow-">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === "All"
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category.category}
                    onClick={() => setSelectedCategory(category.category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category.category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured articles grid */}
            <FeaturedArticlesGrid featuredArticles={explore} />

            {/* More articles */}
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-t pt-4 -mt-6">More to Explore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {explore.slice(2).map(article => (
                <ExploreArticleCard key={article._id} article={article} />
              ))}
            </div>

            {/* Show more button */}
            <div className="flex justify-center mt-12">
              <Link to={`/articles`} className="px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-50 font-medium text-sm">
                Load more articles
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}