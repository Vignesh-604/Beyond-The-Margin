import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import Cookies from "js-cookie";
import { decrypt } from "../Utils/utils";

const GoogleLoginButton = ({ mode }) => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const buttonText = mode === "login" ? "Login" : "Sign up";

    const [currentMode, setCurrentMode] = useState(mode);

    const attemptAuth = async (code, modeToUse) => {
        try {
            const res = await axios.get(`/api/users/auth/google?code=${code}&mode=${modeToUse}`, { withCredentials: true },);
            if (res.data.success) {
                const signedIn = Cookies.get("user")

                let user = signedIn ? decrypt() : null
                user ? navigate("/") : console.log("Not same")
            }

        } catch (error) {
            console.error("Auth attempt failed:", error.response?.data || error.message);
            const message = error.response?.data?.message;

            if (modeToUse === "signup" && message === "User already exists") {
                setCurrentMode("login");
                setShowDialog(true);
            } else if (modeToUse === "login" && message === "User does not exist") {
                setCurrentMode("signup");
                setShowDialog(true);
            }
        }
        // console.log(code);
    };

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async ({ code }) => {
            attemptAuth(code, currentMode);
        },
        onError: (err) => {
            console.error("Google login error", err);
        },
    });


    const handleDialogAction = () => {
        setShowDialog(false);
        googleLogin();
    };

    return (
        <>
            <button
                onClick={() => googleLogin()}
                className="flex items-center justify-center gap-2 border border-gray-300 bg-transparent/70 px-4 py-2 rounded-md shadow-sm hover:scale-105 hover:shadow-md transition-all text-sm font-medium"
            >
                <FcGoogle size={25} />
                {buttonText} with Google
            </button>

            {showDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
                        <h2 className="text-xl font-semibold">Account Issue</h2>
                        <p>
                            {currentMode === "login"
                                ? "This account already exists. Would you like to login instead?"
                                : "No account found. Would you like to sign up instead?"}
                        </p>
                        <div className="flex gap-4 justify-center mt-6">
                            <button
                                onClick={handleDialogAction}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {currentMode === "login" ? "Login instead" : "Sign up instead"}
                            </button>
                            <button
                                onClick={() => setShowDialog(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoogleLoginButton;
