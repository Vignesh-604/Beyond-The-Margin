import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark, BookmarkCheck } from 'lucide-react';
import Loading from '../../Components/Loading';
import axios from 'axios';
import { dateFormat, formatTimestamp } from '../../Utils/utils';
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown.css";
import { useParams, Link } from 'react-router-dom';
import profile from "../../Assets/Profile.png"
import { useAuth } from '../../Utils/context';
import AuthProtectedLink from '../../Components/AuthLink';
import Swal from 'sweetalert2';

export default function ArticlePage() {
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const { currentUser } = useAuth()
  const p = useParams()
  const articleId = p.articleId
  const owner = currentUser._id === article?.user?._id

  useEffect(() => {
    axios.get(`/api/articles/single/${articleId}/${currentUser ? currentUser._id : false}`)
      .then(res => {
        const data = res.data.data;
        setArticle(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });

    // Fetch comments
    fetchComments();
  }, []);

  const fetchComments = () => {
    setCommentsLoading(true);
    axios.get(`/api/comments/${articleId}/${currentUser ? currentUser?._id : false}`)
      .then(res => {
        const data = res.data.data;
        setComments(data);
        setCommentsLoading(false);
      })
      .catch(e => {
        console.log(e);
        setCommentsLoading(false);
      });
  };

  const handleLikeDislike = (type) => {
    if (!currentUser) {
      // Redirect to login or show login prompt
      alert("Please login to interact with this article");
      return;
    }

    axios.post('/api/interactions/like', {
      type: type,
      articleId: articleId
    })
      .then(res => {
        // Update the article state based on the response
        let updatedArticle = { ...article };

        if (res.data.message === `${type} added`) {
          // Added new interaction
          if (type === 'like') {
            updatedArticle.isLiked = true;
            updatedArticle.likeCount += 1;
            if (updatedArticle.isDisliked) {
              updatedArticle.isDisliked = false;
              updatedArticle.dislikeCount -= 1;
            }
          } else if (type === 'dislike') {
            updatedArticle.isDisliked = true;
            updatedArticle.dislikeCount += 1;
            if (updatedArticle.isLiked) {
              updatedArticle.isLiked = false;
              updatedArticle.likeCount -= 1;
            }
          }
        } else if (res.data.message === `${type} updated`) {
          // Switched from like to dislike or vice versa
          if (type === 'like') {
            updatedArticle.isLiked = true;
            updatedArticle.likeCount += 1;
            updatedArticle.isDisliked = false;
            updatedArticle.dislikeCount -= 1;
          } else if (type === 'dislike') {
            updatedArticle.isDisliked = true;
            updatedArticle.dislikeCount += 1;
            updatedArticle.isLiked = false;
            updatedArticle.likeCount -= 1;
          }
        } else if (res.data.message === `${type} removed`) {
          // Removed interaction
          if (type === 'like') {
            updatedArticle.isLiked = false;
            updatedArticle.likeCount -= 1;
          } else if (type === 'dislike') {
            updatedArticle.isDisliked = false;
            updatedArticle.dislikeCount -= 1;
          }
        }

        setArticle(updatedArticle);
      })
      .catch(e => {
        console.log(e);
        alert("Failed to process your interaction");
      });
  };

  const handleCommentLikeDislike = (commentId, type) => {
    if (!currentUser) {
      alert("Please login to interact with comments");
      return;
    }
    console.log(type, commentId);

    axios.post('/api/interactions/like', {
      type: type,
      commentId: commentId
    })
      .then(res => {
        // Refresh comments to show updated likes/dislikes
        fetchComments();
      })
      .catch(e => {
        console.log(e);
        alert("Failed to process your interaction");
      });
  };

  const toggleBookmark = () => {
    if (!currentUser) {
      alert("Please login to bookmark articles");
      return;
    }

    axios.get(`/api/interactions/bookmark/${articleId}`)
      .then(res => {
        // console.log(res.data);
        setArticle({ ...article, isBookmarked: !article.isBookmarked })
      })
      .catch(e => {
        console.log(e);
        alert("Failed to bookmark article");
      });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to comment");
      return;
    }

    if (commentText.trim() === "") return;

    axios.post('/api/comments', {
      articleId: articleId,
      content: commentText
    })
      .then(res => {
        setCommentText("");
        fetchComments();
      })
      .catch(e => {
        console.log(e);
        alert("Failed to post comment");
      });
  };

  const handleSubmitReply = (e, commentId) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to reply");
      return;
    }

    if (replyText.trim() === "") return;

    axios.post('/api/comments', {
      articleId: articleId,
      content: replyText,
      commentId: commentId
    })
      .then(res => {
        setReplyText("");
        setReplyingTo(null);
        fetchComments(); // Refresh comments
      })
      .catch(e => {
        console.log(e);
        alert("Failed to post reply");
      });
  };

  const handleReplyClick = (commentId) => {
    if (!currentUser) {
      alert("Please login to reply");
      return;
    }
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  const toggleFollow = () => {
    axios.post(`/api/follows/${article.user._id}`)
      .then(res => {
        const data = res.data.data
        setArticle({ ...article, follow: data })
      })
  }

  const rejectionReason = () => {
    Swal.fire({
      icon: 'error',
      title: "Article Rejected",
      text: undefined,
      html: `<b>Reason:</b><br>${article.reason}`,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6"
    });
  }

  if (loading) return <Loading />

  const totalComments = comments.reduce((count, comment) => count + 1 + (comment.replies ? comment.replies.length : 0), 0);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Article Container */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="p-6 border-b bg-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block bg-emerald-300 text-gray-800 px-3 py-1 text-sm font-semibold rounded-full mb-4">{article.category}</span>
                <span className="mx-2">{">"}</span>
                <span className="inline-block bg-emerald-300 text-gray-800 px-3 py-1 text-sm font-semibold rounded-full mb-4">{article.subCategory}</span>
              </div>
              <div className="text-gray-500 items-center">
                <span>{dateFormat(article.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime} min read</span>
                {article.status !== "approved" && (
                  <>
                    <span className="mx-2">•</span>
                    <span onClick={article.status == "rejected" && rejectionReason}
                      className={`inline-block ${article.status == "pending" ? "bg-yellow-500 text-gray-800" : "bg-red-500 text-white cursor-pointer"} capitalize px-3 py-1 text-sm font-semibold rounded-full mb-4`}
                    >
                      {article.status}
                    </span>
                  </>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{article.title}</h1>

            {/* Author Info */}
            <div className='flex justify-between items-center mt-4'>
              <Link to={`/profile/${article?.user?._id}`} className="flex items-center bg-gray-200 w-fit">
                <img src={article.user?.avatar} onError={() => profile} alt="Author avatar" className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                  <div className="flex items-center flex-col">
                    <h3 className="font-medium text-gray-900">{article.user?.fullname}</h3>
                    <div className="text-gray-500">@{article.user?.username}</div>
                  </div>
                </div>
              </Link>
              {!owner && (
                <button onClick={toggleFollow}
                  className={`px-6 py-2 border transition-transform shadow-sm rounded-full font-semibold border-green-600 hover:scale-110 duration-300 ease-out
                ${article.follow ?
                      "hover:bg-white hover:text-green-600 bg-green-600 text-white"
                      : " text-green-600 hover:bg-green-600 hover:text-white"}
                    ${!currentUser && "hidden"}
                    `}>
                  {article.follow ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="markdown-body border rounded p-4">
            <p><em>{article.subtitle}</em></p>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Article Actions */}
          {currentUser ? (
            <div className="px-6 py-4 border-t border-b flex justify-between items-center">
              <div className="flex space-x-6">
                <button
                  className={`flex items-center ${article.isLiked ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
                  onClick={() => handleLikeDislike('like')}
                >
                  {article.isLiked ? <ThumbsUp fill='green' className="w-5 h-5 mr-2" /> : <ThumbsUp className="w-5 h-5 mr-2" />}
                  <span>{article.likeCount || 0} Likes</span>
                </button>
                <button
                  className={`flex items-center ${article.isDisliked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                  onClick={() => handleLikeDislike('dislike')}
                >
                  {article.isDisliked ? <ThumbsDown fill='red' className="w-5 h-5 mr-2" /> : <ThumbsDown className="w-5 h-5 mr-2" />}
                  <span>{article.dislikeCount || 0} Dislikes</span>
                </button>
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>{totalComments} Comments</span>
                </div>
              </div>
              <button
                className={`flex items-center ${article.isBookmarked ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                onClick={toggleBookmark}
              >
                {article.isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 mr-2" />
                ) : (
                  <Bookmark className="w-5 h-5 mr-2" />
                )}
                <span>{article.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <AuthProtectedLink
                to="/"
                className="bg-emerald-600 text-white p-3 m-4 rounded-lg shadow-lg"
                title="Join Our Community"
                message="Please log in to interact with this article."
              >
                Sign up or Login to interact with the article

              </AuthProtectedLink>
            </div>
          )}

          {/* Comment Section */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Comments ({totalComments})
            </h3>

            {/* Comment Form */}
            {currentUser && (
              <form onSubmit={handleSubmitComment} className="flex mb-8">
                <img src={currentUser.avatar || profile} alt="Your avatar" className="min-w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">Loading comments...</div>
            ) : (
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="border-b pb-6">
                      <div className="flex">
                        <img src={comment.user?.avatar || profile} alt="Commenter avatar" className="min-w-10 h-10 rounded-full mr-4" />
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium text-gray-900 mr-2">{comment.user?.fullname}</h4>
                            <span className="text-gray-500 text-sm">@{comment.user?.username}</span>
                            {comment.user?._id === article.user?._id && (
                              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded ml-2">Author</span>
                            )}
                            <span className="text-gray-400 text-sm ml-2">• {formatTimestamp(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{comment.content}</p>

                          {currentUser && (
                            <div className="flex items-center text-sm">
                              <button
                                className="text-gray-500 hover:text-emerald-600 mr-4"
                                onClick={() => handleCommentLikeDislike(comment._id, 'like')}
                              >
                                {comment.isLiked ? <ThumbsUp fill='green' className="w-4 h-4 inline mr-1" /> : <ThumbsUp className="w-4 h-4 inline mr-1" />}
                                {comment.likeCount || 0}
                              </button>
                              <button
                                className="text-gray-500 hover:text-red-600 mr-4"
                                onClick={() => handleCommentLikeDislike(comment._id, 'dislike')}
                              >
                                {comment.isDisliked ? <ThumbsDown fill='red' className="w-4 h-4 inline mr-1" /> : <ThumbsDown className="w-4 h-4 inline mr-1" />}
                                {comment.dislikeCount || 0}
                              </button>
                              <button
                                className="text-gray-500 hover:text-emerald-600"
                                onClick={() => handleReplyClick(comment._id)}
                              >
                                <MessageSquare className="w-4 h-4 inline mr-1" /> Reply
                              </button>
                            </div>
                          )}

                          {/* Reply Form */}
                          {currentUser && replyingTo === comment._id && (
                            <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="mt-4">
                              <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                rows="2"
                                placeholder={`Reply to ${comment.user?.fullname}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button
                                  type="button"
                                  className="text-gray-500 mr-2 px-3 py-1"
                                  onClick={() => setReplyingTo(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700"
                                >
                                  Reply
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Nested Replies */}
                          {comment.replies && comment.replies.map((reply) => (
                            <div key={reply._id} className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                              <div className="flex">
                                <img src={reply.user?.avatar || profile} alt="Reply avatar" className="min-w-8 h-8 rounded-full mr-3" />
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <h4 className="font-medium text-gray-900 mr-2">{reply.user?.fullname}</h4>
                                    <span className="text-gray-500 text-sm">@{reply.user?.username}</span>
                                    {reply.user?._id === article.user?._id && (
                                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded ml-2">Author</span>
                                    )}
                                    <span className="text-gray-400 text-sm ml-2">• {formatTimestamp(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700 mb-3">{reply.content}</p>

                                  {currentUser && (
                                    <div className="flex items-center text-sm">
                                      <button
                                        className="text-gray-500 hover:text-emerald-600 mr-4"
                                        onClick={() => handleCommentLikeDislike(reply._id, 'like')}
                                      >
                                        {reply.isLiked ? <ThumbsUp fill='green' className="w-4 h-4 inline mr-1" /> : <ThumbsUp className="w-4 h-4 inline mr-1" />}
                                        {reply.likeCount || 0}
                                      </button>
                                      <button
                                        className="text-gray-500 hover:text-red-600 mr-4"
                                        onClick={() => handleCommentLikeDislike(reply._id, 'dislike')}
                                      >
                                        {reply.isDisliked ? <ThumbsDown fill='red' className="w-4 h-4 inline mr-1" /> : <ThumbsDown className="w-4 h-4 inline mr-1" />}
                                        {reply.dislikeCount || 0}
                                      </button>
                                      <button
                                        className="text-gray-500 hover:text-emerald-600"
                                        onClick={() => handleReplyClick(comment._id)}
                                      >
                                        <MessageSquare className="w-4 h-4 inline mr-1" /> Reply
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Load More Comments Button - Only show if needed */}
                {comments.length >= 10 && (
                  <button className="w-full py-3 text-emerald-600 hover:text-emerald-800 font-medium">
                    Load More Comments
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}