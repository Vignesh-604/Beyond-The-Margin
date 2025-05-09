import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Utils/context";
import LoginPopup from "./LoginPopup";


export default function AuthProtectedLink({
    to,
    children,
    className,
    message = "Please log in to access this content.",
    title = "Login Required"
}) {
    const { currentUser } = useAuth();
    const [showLoginPopup, setShowLoginPopup] = useState(false);


    // Check if user is authenticated
    const isAuthenticated = () => {
        if (currentUser) return true;
        return false;
    };

    // Handle link click
    const handleClick = (e) => {
        if (!isAuthenticated()) {
            e.preventDefault();
            setShowLoginPopup(true);
        }
    };

    return (
        <>
            <Link to={to} className={className} onClick={handleClick}>
                {children}
            </Link>

            <LoginPopup
                isOpen={showLoginPopup}
                onClose={() => setShowLoginPopup(false)}
                title={title}
                message={message}
            />
        </>
    );
}