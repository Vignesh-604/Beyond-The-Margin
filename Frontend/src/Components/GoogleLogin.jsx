import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = ({mode}) => {
    const navigate = useNavigate();
    console.log(mode)
    const btn = mode === "login" ? "Login" : "Sign up";

    const handleGoogleLogin = useGoogleLogin({
        flow: "auth-code", // REQUIRED for backend token exchange
        onSuccess: async ({ code }) => {
            try {
                const res = await axios.get(`http://localhost:8888/api/users/auth/google?code=${code}&mode=${mode}`, {withCredentials: true});
                
                const { user } = res.data;
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/dashboard"); // or wherever you want
            } catch (error) {
                console.error("Login failed:", error.response.data);
            }
        },
        onError: (err) => {
            console.error("Google login error", err);
        },
    });

    return (
        <button onClick={handleGoogleLogin} className="btn-google">
            {btn} with Google
        </button>
    );
};

export default GoogleLoginButton;
