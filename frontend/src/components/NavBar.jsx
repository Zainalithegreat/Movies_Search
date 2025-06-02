import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "../static/NavBar.css";


function NavBar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    function Logout(e){
        localStorage.clear();
        navigate("/login")
    }
    return (
        username && (
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">Movie App</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/home" className="nav-link">Home</Link>
                    <Link to="/favorites" className="nav-link">Favorites</Link>
                </div>
                <button onClick={Logout} className="nav-link">Logout</button>
            </nav>
        )
    );
}

export default NavBar