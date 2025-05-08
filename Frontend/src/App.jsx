import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import { useAuth } from "./Utils/context"

function App() {
  const location = useLocation()
  const user = useAuth()

  const hideLayout = location.pathname === "/login"

  return (
    <div className="bg-gray-50 min-h-screen">
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
