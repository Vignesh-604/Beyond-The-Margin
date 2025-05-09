import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ExploreArticleCard } from '../../Components/ArticleCards';
import axios from 'axios';
import Loading from '../../Components/Loading';
import { dateFormat } from '../../Utils/utils';
import profile from "../../Assets/Profile.png"
import { useAuth } from '../../Utils/context';

const ProfilePage = () => {
  const { currentUser } = useAuth()
  const [user, setUser] = useState([])
  const [activeTab, setActiveTab] = useState('articles');
  const [userArticles, setUserArticles] = useState([])
  const [bookmarkedArticles, setBookmarkedArticles] = useState([])
  const [followingUsers, setFollowingUsers] = useState([])
  const [followers, setFollowers] = useState([])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const p = useParams()
  const userId = p.userId ? p.userId : currentUser?._id

  useEffect(() => {
    if (!currentUser) navigate(-1)
    else {
      axios.get(`/api/users/${userId}`)
        .then((res) => {
          const data = res.data.data
          setUser(data)
          setLoading(false)
        })
        .catch(e => {
          console.log(e);
        })
    }
  }, [])

  useEffect(() => {
    switch (activeTab) {
      case "articles":
        axios.get(`/api/articles/user/${userId}`)
          .then((res) => {
            const data = res.data.data
            setUserArticles(data)
          })
          .catch(e => {
            console.log(e);
          })
        break;
      case "bookmarks":
        axios.get(`/api/articles/bookmark/${userId}`)
          .then((res) => {
            const data = res.data.data
            setBookmarkedArticles(data)
          })
          .catch(e => {
            console.log(e);
          })
        break;
      case "followers":
        axios.get(`/api/follows/${userId}`)
          .then((res) => {
            const data = res.data.data
            setFollowers(data)
          })
          .catch(e => {
            console.log(e);
          })
        break;
      case "following":
        axios.get(`/api/follows/follow/${userId}`)
          .then((res) => {
            const data = res.data.data
            setFollowingUsers(data)
          })
          .catch(e => {
            console.log(e);
          })
        break;
      default:
        console.log("Not valid");
        break;
    }

  }, [activeTab])


  // Function to render profile cards for following/followers
  const renderProfileCard = (user) => (
    <div key={user._id} className="flex items-start p-4 border rounded-lg shadow-sm">
      <div className="flex-shrink-0 mr-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={user?.avatar || profile}
            alt={user?.fullname || "User"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = profile;
            }}
          />
        </div>
      </div>

      {/* Rest of the profile card content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{user?.fullname}</h3>
        <p className="text-sm text-gray-500 mb-1">@{user?.username}</p>

        {user?.userType !== "user" && (
          <div className="mt-2">
            <span className="px-2 py-0.5 text-xs text-white bg-green-600 rounded-full uppercase">
              {user?.userType}
            </span>
          </div>
        )}
      </div>

      <div className="ml-4">
        <button className="px-4 py-1 text-sm border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors">
          Follow
        </button>
      </div>
    </div>
  );

  if (loading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">

      {/* Profile Header with User Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-md">
            <img src={user.user?.avatar} alt={user.user?.fullname} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{user.user?.fullname}</h1>
            <p className="text-gray-600 mb-3">@{user.user?.username}</p>

            {user.user?.about && (
              <p className="text-gray-700 mb-4 max-w-2xl">{user.user?.about}</p>
            )}

            <div className="flex items-center space-x-6 text-sm">
              <Link to={`/user/${user.user?.username}/articles`} className="flex items-center">
                <span className="font-semibold mr-1">{user.articles}</span> Articles
              </Link>
              <Link to={`/user/${user.user?.username}/bookmarks`} className="flex items-center">
                <span className="font-semibold mr-1">{user.bookmarks}</span> Bookmarks
              </Link>
              <button
                onClick={() => setActiveTab('following')}
                className="flex items-center"
              >
                <span className="font-semibold mr-1">{user.following}</span> Following
              </button>
              <button
                onClick={() => setActiveTab('followers')}
                className="flex items-center"
              >
                <span className="font-semibold mr-1">{user.followers}</span> Followers
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              {user.user?.userType !== "user" && (
                <span className="px-3 py-1 text-xs text-white bg-green-600 rounded-full uppercase">
                  {user.user?.userType}
                </span>
              )}
              <span className="text-sm text-gray-500">Member since {dateFormat(user.user?.createdAt)}</span>
            </div>
          </div>

          <div>
            <button className="px-6 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors shadow-sm">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`px-1 py-4 border-b-2 font-medium ${activeTab === 'articles'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-1 py-4 border-b-2 font-medium ${activeTab === 'bookmarks'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </button>
          <button
            className={`px-1 py-4 border-b-2 font-medium ${activeTab === 'following'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
          <button
            className={`px-1 py-4 border-b-2 font-medium ${activeTab === 'followers'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
        </nav>
      </div>

      {/* User's Articles Tab Content */}
      {activeTab === 'articles' && (
        <div className="mb-12">
          <div className="grid gap-4">
            {userArticles.map(article => (
              <div key={article._id} className="mb-4">
                <ExploreArticleCard article={article} profile={true} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to={`/user/${user.username}/articles`} className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              View All Articles
            </Link>
          </div>
        </div>
      )}

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="mb-12">
          <div className="grid gap-4">
            {bookmarkedArticles.map(article => (
              <div key={article._id} className="mb-4">
                <ExploreArticleCard article={article} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to={`/user/${user.username}/bookmarks`} className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              View All Bookmarks
            </Link>
          </div>
        </div>
      )}

      {/* Following Tab Content */}
      {activeTab === 'following' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Following</h2>
          <div className="grid grid-cols-1 gap-4">
            {followingUsers.map(followingUser => renderProfileCard(followingUser))}
          </div>

          {followingUsers.length > 4 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Followers Tab Content */}
      {activeTab === 'followers' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Followers</h2>
          <div className="grid grid-cols-1 gap-4">
            {followers.map(follower => renderProfileCard(follower))}
          </div>

          {followers.length > 4 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;