import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ mode }) => {
    const buttonText = mode === "login" ? "Login" : "Sign up";

    // Full-page redirect flow (no popup) to avoid Cross-Origin-Opener-Policy
    // warnings. The backend redirects to Google, then back to the app with a
    // ?code=..., which App.jsx exchanges for the session cookies.
    const googleLogin = () => {
        window.location.href = `/api/users/auth/google?mode=${mode}`;
    };

    return (
        <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 border border-gray-300 text-white bg-transparent/70 px-4 py-2 rounded-md shadow-sm hover:scale-105 hover:shadow-md transition-all text-sm font-medium"
        >
            <FcGoogle size={25} />
            {buttonText} with Google
        </button>
    );
};

export default GoogleLoginButton;