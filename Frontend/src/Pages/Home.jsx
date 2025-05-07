import { useEffect, useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { TrendingArticleCard, ExploreArticleCard, FeaturedArticlesGrid } from '../Components/ArticleCards';
import axios from "axios"
import { dateFormat } from '../Utils/utils';
import Loading from '../Components/Loading';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trending, setTrending] = useState([])
  const [explore, setExplore] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/articles/trending`)
      .then(res => {
        const data = res.data.data
        console.log(data);
        
        setTrending(data)
        setLoading(false)
      })
      .catch(e => {
        console.log(e);
        // setLoading(false)
      })
  }, [])

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


  // Extract unique categories
  const categories = ['All', "Software Engineering", "Programming Languages", "Lifestyle & Personal Growth", "Artificial Intelligence"];

  if (loading) return <Loading/>

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main>
        {/* Hero featured article */}
        <section className="py-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center text-sm">
                  <span className="uppercase tracking-wider font-medium text-emerald-600">Featured Story</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">{dateFormat(trending[0]?.createdAt)}</span>
                </div>

                <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
                  {trending[0]?.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {trending[0]?.subtitle}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center">
                    <img
                    src={trending[0]?.user.avatar}
                    className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium" />

                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{trending[0]?.user.fullname}</p>
                      <p className="text-sm text-gray-500">{trending[0]?.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {trending[0]?.readTime} min read
                  </div>
                </div>

                <div className="pt-4">
                  <a href="#" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-800">
                    Continue reading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending now */}
        <section className="py-10 border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Trending Now</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="inline-flex space-x-2 pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {category}
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
              <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-800 hover:bg-gray-50 font-medium text-sm">
                Load more articles
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}