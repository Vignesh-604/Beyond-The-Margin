import profile from "../Assets/Profile.png"
import { Link } from 'react-router-dom';


function FollowCard({ user }) {
    return (
        <Link key={user._id} to={`/profile/${user._id}`}
            className="flex items-start p-4 border rounded-lg bg-gray-200/60 hover:bg-gray-200 border-gray-100 hover:shadow-md"
        >
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

            {/* <div className="ml-4">
                <button className="px-4 py-1 text-sm border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                    Follow
                </button>
            </div> */}
        </Link>
    )
}

export default FollowCard