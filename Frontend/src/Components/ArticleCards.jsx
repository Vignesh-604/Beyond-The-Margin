import { Clock } from 'lucide-react';
import { dateFormat } from '../Utils/utils.';

// Trending article card component
export function TrendingArticleCard({ article }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center text-xs mb-4">
        <span className="uppercase tracking-wider font-medium text-emerald-600">{article?.category}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-gray-500">{dateFormat(article?.createdAt)}</span>
      </div>

      <a href="#" className="block mb-3">
        <h3 className="text-xl font-serif font-bold text-gray-900 hover:text-emerald-600 transition-colors">
          {article?.title}
        </h3>
      </a>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {article?.subtitle}
      </p>

      <div className="flex items-center justify-between">
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
          By {article?.user.fullname}
        </a>
        <span className="text-xs flex items-center text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {article?.readTime} min read
        </span>
      </div>
    </div>
  );
}

// More to explore article card component
export function ExploreArticleCard({ article }) {
  return (
    <article className="flex flex-col border-b border-gray-200 pb-6">
      <div className="flex items-center text-xs mb-3">
        <span className="uppercase tracking-wider font-medium text-emerald-600">{article?.category}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-gray-500">{dateFormat(article?.createdAt)}</span>
      </div>

      <a href="#" className="block mb-3">
        <h3 className="text-xl font-serif font-bold text-gray-900 hover:text-emerald-600 transition-colors">
          {article?.title}
        </h3>
      </a>

      <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
        {article?.subtitle}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
          By {article?.user.fullname}
        </a>
        <span className="text-xs flex items-center text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {article?.readTime} min read
        </span>
      </div>
    </article>
  );
}

function FeaturedArticleCard({
  article,
  isMainArticle = false,
  borderColor = "border-emerald-600",
  className = ""
}) {
  return (
    <div className={`${className}`}>
      <div className={`border-t-4 ${borderColor} pb-4`}></div>
      <div className="flex items-center text-xs mb-3">
        <span className="uppercase tracking-wider font-medium text-emerald-600">{article?.category}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-gray-500">{dateFormat(article?.createdAt)}</span>
      </div>

      <a href="#" className="block mb-3">
        <h3 className={`${isMainArticle ? 'text-3xl' : 'text-2xl'} font-serif font-bold text-gray-900 hover:text-emerald-600 transition-colors`}>
          {article?.title}
        </h3>
      </a>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {article?.subtitle}
      </p>

      {isMainArticle ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
            src={article?.user.avatar}
            className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{article?.user.fullname}</p>
            </div>
          </div>
          <span className="text-sm flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {article?.readTime} min read
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            By {article?.user.fullname}
          </div>
          <span className="text-sm flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {article?.readTime} min read
          </span>
        </div>
      )}
    </div>
  );
}

// Usage example in the featured articles grid
export function FeaturedArticlesGrid({ featuredArticles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12  text-white">
      {/* Main featured article */}
      <div className="md:col-span-8">
        <FeaturedArticleCard
          article={featuredArticles[0]}
          isMainArticle={true}
          borderColor="border-emerald-600"
          className="text-white"
        />
      </div>

      {/* Secondary featured article */}
      <div className="md:col-span-4">
        <FeaturedArticleCard
          article={featuredArticles[1]}
          borderColor="border-gray-300"
          className="text-white"
        />
      </div>
    </div>
  );
}