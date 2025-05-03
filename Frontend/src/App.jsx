import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import { decrypt } from "./Utils/utils.";
import { useEffect } from "react";
import Navbar from "./Components/Navbar";

function App() {
  const navigate = useNavigate();

  const signedIn = Cookies.get("user")

  let user = signedIn ? decrypt() : null
  console.log(user);
  
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, [])
  
  return (
  <div className="bg-gray-50 h-screen">
    <Navbar />
    <Outlet context={user}/>
  </div>
  );
}

export default App;
