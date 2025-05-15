import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLogin";
import { useAuth } from "../Utils/context";
import { X } from "lucide-react";
import login from "../Assets/login.jpg"


export default function LoginPopup({ isOpen, onClose, message, title = "Login Required" }) {
    const { currentUser } = useAuth();
    const [closing, setClosing] = useState(false);

    // Handle successful login
    const handleLoginSuccess = () => {
        // Close the popup when login is successful
        handleClose();
    };

    // Close the popup if user becomes authenticated
    useEffect(() => {
        if (currentUser && isOpen) {
            onClose();
        }
    }, [currentUser, isOpen, onClose]);

    // Handle closing animation
    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 100);
    };

    // Close when clicking outside the popup
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Close on escape key press
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed -inset-4 flex items-center cursor-default justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-300 
                ${closing ? "opacity-0" : "opacity-100"}`}
            onClick={handleOutsideClick}
        >
            <div
                className={`relative bg-opacity-50 rounded-lg p- max-w-md w-full mx-4 shadow-2xl transition-all duration-300 shadow-emerald-800
                    ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
                style={{
                    backgroundImage: `url(${login})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-70 rounded-lg z-0" />

                <div className="relative z-10 p-8 text-white">
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        onClick={handleClose}
                    >
                        <X />
                    </button>

                    <h2 className="text-3xl font-bold mb-4">{title}</h2>

                    <p className="text-gray-200 mb-8 font-semibold">
                        {message || "Please log in to access this content and join our community of writers and readers."}
                    </p>

                    <div className="flex flex-col space-y-4">
                        <GoogleLoginButton mode="login" onLoginSuccess={handleLoginSuccess} />
                        <GoogleLoginButton mode="signup" onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            </div>

        </div>
    );
}