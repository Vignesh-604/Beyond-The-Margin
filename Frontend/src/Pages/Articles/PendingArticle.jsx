import { useState, useEffect } from 'react';
import Loading from '../../Components/Loading';
import axios from 'axios';
import { dateFormat } from '../../Utils/utils';
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown.css";
import { useNavigate, useParams, Link } from 'react-router-dom';
import profile from "../../Assets/Profile.png";
import { useAuth } from '../../Utils/context';
import { toast, Toaster } from 'react-hot-toast';

export default function PendingArticle() {
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);
    const [reason, setReason] = useState("");

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { articleId } = useParams();

    useEffect(() => {
        if (!currentUser || currentUser.userType == "user") navigate(-1)
        axios.get(`/api/articles/single/${articleId}/${currentUser ? currentUser._id : false}`)
            .then(res => {
                const data = res.data.data
                if (data.status !== "pending") navigate(-1)
                setArticle(data);
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
    }, []);

    const handleApproval = async (status) => {
        if (status === "rejected" && reason.trim() === "") {
            return toast.error("Reason is required for rejection");
        }

        try {
            await axios.put(`/api/articles/approve/${articleId}`, {
                status,
                ...(status === "rejected" && { reason })
            });

            toast.success(`Article ${status}`);
            navigate(`/articles/${articleId}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update article status");
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-gray-50 font-sans min-h-screen">
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
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
                                        <span className="inline-block bg-yellow-500 text-gray-800 capitalize px-3 py-1 text-sm font-semibold rounded-full mb-4">{article.status}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{article.title}</h1>

                        <div className='flex justify-between items-center mt-4'>
                            <Link to={`/profile/${article?.user?._id}`} className="flex items-center bg-gray-200 w-fit">
                                <img
                                    src={article.user?.avatar || profile}
                                    onError={(e) => e.target.src = profile}
                                    alt="Author avatar"
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <div>
                                    <div className="flex items-center flex-col">
                                        <h3 className="font-medium text-gray-900">{article.user?.fullname}</h3>
                                        <div className="text-gray-500">@{article.user?.username}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="markdown-body border rounded p-4">
                        <p><em>{article.subtitle}</em></p>
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>

                    {/* Admin Section */}
                    {currentUser?.userType === "admin" && article.status !== "approved" && (
                        <div className="p-4 flex flex-col gap-4">
                            <textarea
                                placeholder="Reason for rejection (required only for rejection)"
                                rows={3}
                                className="resize-none p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={() => handleApproval("approved")}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg py-2 px-4 rounded-lg"
                                >
                                    Approve Article
                                </button>
                                <button
                                    onClick={() => handleApproval("rejected")}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold text-lg py-2 px-4 rounded-lg"
                                >
                                    Reject Article
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <Toaster/>
            </main>
        </div>
    );
}
