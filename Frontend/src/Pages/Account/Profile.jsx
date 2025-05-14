import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExploreArticleCard } from '../../Components/ArticleCards';
import axios from 'axios';
import Loading from '../../Components/Loading';
import { dateFormat } from '../../Utils/utils';
import { useAuth } from '../../Utils/context';
import FollowCard from '../../Components/FollowCard';

const ProfilePage = () => {
  const { currentUser } = useAuth()
  const [user, setUser] = useState()
  const [activeTab, setActiveTab] = useState('articles');
  const [userArticles, setUserArticles] = useState([])
  const [bookmarkedArticles, setBookmarkedArticles] = useState([])
  const [followingUsers, setFollowingUsers] = useState([])
  const [followers, setFollowers] = useState([])
  const [pendingArticles, setPendingArticles] = useState([])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const p = useParams()
  const userId = p.userId ? p.userId : currentUser?._id

  const role = user?.user?.userType || ""
  const owner = userId == currentUser?._id

  useEffect(() => {
    if (!currentUser) navigate(-1)
    else {
      axios.get(`/api/users/${userId}/${currentUser?._id}`)
        .then((res) => {
          const data = res.data.data
          setUser(data)
          setLoading(false)
        })
        .catch(e => {
          console.log(e);
        })
    }
  }, [userId])

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
      case "pending":
        axios.get(`/api/articles/pending`)
          .then((res) => {
            const data = res.data.data
            setPendingArticles(data)
          })
          .catch(e => {
            console.log(e);
          })
        break;
      default:
        console.log("Not valid");
        break;
    }

  }, [activeTab, userId])

  const toggleFollow = () => {
    axios.post(`/api/follows/${userId}`)
      .then(res => {
        const data = res.data.data
        setUser({ ...user, follow: data, followers: data ? user.followers + 1 : user.followers - 1 })
      })
  }


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

            {/* User Stats row */}
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={() => setActiveTab('articles')}
                className="flex items-center"
              >
                <span className="font-semibold mr-1">{user.articles}</span> Articles
              </button>
              <button
                onClick={userId == currentUser._id && (() => setActiveTab('bookmarks'))}
                className="flex items-center"
              >
                <span className="font-semibold mr-1">{user.bookmarks}</span> Bookmarks
              </button>
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
              {role !== "user" && (
                <span className={`px-3 py-1 text-sm font-semibold rounded-full uppercase border
                  ${role == "admin" ? " text-white bg-green-600" : "text-green-600 border-green-600"}`}
                >
                  {role}
                </span>
              )}
              <span className="text-sm text-gray-500">Member since {dateFormat(user.user?.createdAt)}</span>
            </div>
          </div>
          {
            !owner && (
              <button onClick={toggleFollow}
                className={`px-6 py-2 border transition-transform shadow-sm rounded-full font-semibold border-green-600 hover:scale-110 duration-300 ease-out
                ${user.follow ?
                    "hover:bg-white hover:text-green-600 bg-green-600 text-white"
                    : " text-green-600 hover:bg-green-600 hover:text-white"}`}
              >
                {user.follow ? "Following" : "Follow"}
              </button>
            )
          }
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex justify-between border-b border-gray-200 mb-6">
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
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              ${!owner && "hidden"}
              `}
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
        <nav className={`flex space-x-8 ${!((role !== "user") && owner) && "hidden"}`}>
          <button
            className={`px-1 py-4 border-b-2 font-medium ${activeTab === 'pending'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </nav>
      </div>

      {/* User's Articles Tab Content */}
      {activeTab === 'articles' && (
        <div className="mb-12">
          {
            userArticles.length > 0 ? (
              <div className="grid gap-4">
                {userArticles.map(article => (
                  <div key={article._id} className="mb-4">
                    <ExploreArticleCard article={article} type={"profile"} />
                  </div>
                ))}
              </div>
            ) : (
              !owner ? (
                <h2 className="flex justify-center text-2xl font-bold mb-6">{user.user.fullname} has not published any articles</h2>
              ) : (
                <Link to={"/publish"} className="flex justify-center text-2xl font-bold mb-6 text-emerald-600">Publish your first article!!</Link>
              )
            )
          }

          {/* <div className="mt-8 text-center">
            <Link to={`/user/${user.username}/articles`} className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              View All Articles
            </Link>
          </div> */}
        </div>
      )}

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="mb-12">
          {
            bookmarkedArticles.length > 0 ? (
              <div className="grid gap-4">
                {bookmarkedArticles.map(article => (
                  <div key={article._id} className="mb-4">
                    <ExploreArticleCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <h2 className="flex justify-center text-2xl font-bold mb-6">
                You don't have any bookmarks
              </h2>
            )
          }

          {/* <div className="mt-8 text-center">
            <Link to={`/user/${user.username}/bookmarks`} className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              View All Bookmarks
            </Link>
          </div> */}
        </div>
      )}

      {/* Following Tab Content */}
      {activeTab === 'following' && (
        <div className="mb-12">
          {
            followingUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {followingUsers.map(followingUser => <FollowCard user={followingUser} />)}
              </div>
            ) : (
              <h2 className="flex justify-center text-2xl font-bold mb-6">
                {owner ? "You don't" : user.user.fullname + " doesn't "} follow any accounts
              </h2>
            )
          }

          {/* {followingUsers.length > 4 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                Load More
              </button>
            </div>
          )} */}
        </div>
      )}

      {/* Followers Tab Content */}
      {activeTab === 'followers' && (
        <div className="mb-12">
          {
            followers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">

                {followers.map(follower => <FollowCard user={follower} />)}
              </div>
            ) : (
              <h2 className="flex justify-center text-2xl font-bold mb-6">
                {owner ? "You don't" : user.user.fullname + " doesn't "} have any followers
              </h2>)
          }

          {/* {followers.length > 4 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                Load More
              </button>
            </div>
          )} */}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="mb-12">
          {
            pendingArticles.length > 0 ? (
              <div className="grid gap-4">
                {pendingArticles.map(article => (
                  <div key={article._id} className="mb-4">
                    <ExploreArticleCard article={article} type={"pending"} />
                  </div>
                ))}
              </div>
            ) : (
              <h2 className="flex justify-center text-2xl font-bold mb-6">
                You don't have any pending
              </h2>
            )
          }

          {/* <div className="mt-8 text-center">
            <Link to={`/user/${user.username}/pending`} className="px-6 py-2 bg-white shadow-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              View All pending
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;