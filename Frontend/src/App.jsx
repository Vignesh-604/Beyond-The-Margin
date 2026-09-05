import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import { useAuth } from "./Utils/context"

function App() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state") || "";

    // Google redirects back here with ?code=...&state=<mode> after OAuth.
    if (code) {
      (async () => {
        try {
          await axios.get(`/api/users/auth/google?code=${code}&mode=${state || "login"}`);
          await refreshUser();
          toast.success(state === "signup" ? "Account created successfully" : "Signed in successfully");
        } catch (err) {
          const message = err.response?.data?.message;
          toast.error(message || "Google sign-in failed");
        } finally {
          window.history.replaceState({}, "", window.location.pathname);
        }
      })();
    }
  }, [refreshUser]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;