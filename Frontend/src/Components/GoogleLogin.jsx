import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        flow: "auth-code", // REQUIRED for backend token exchange
        onSuccess: async ({ code }) => {
            try {
                const res = await axios.get(`http://localhost:8888/api/users/auth/google?code=${code}`, {withCredentials: true})
                
                const { user } = res.data;
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/dashboard"); // or wherever you want
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        onError: (err) => {
            console.error("Google login error", err);
        },
    });

    return (
        <button onClick={handleGoogleLogin} className="btn-google">
            Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;
