import { useNavigate } from "react-router-dom";
import axios from "axios"

const Dashboard = () => {
    const navigate = useNavigate();
    const logout = () => {
        axios.get(`/api/users/logout`, {withCredentials: true})
            .then(res => {
                console.log(res.data)
                // navigate("/login")
            })
            .catch(e => console.error(e.response.data.message));
    }
    return (
        <div>
            <h1>Dashboard - Protected Page</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
