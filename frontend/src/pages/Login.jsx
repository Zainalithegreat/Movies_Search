import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import "../static/loginRegister.css"

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;


    async function Logging(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem("username", data.user.username);
                navigate('/home'); // OR use state to show <Home />
            } else {
                const err = await response.json();
                alert("❌ " + err.message);
            }
        } catch (err) {
            console.error("❌ Login error:", err);
        }
    }

    return(
        <>
            <div className="content">
                <div className="form-container">
                    <form method="Post" onSubmit={Logging}>
                        <div className="form-group">
                            <label htmlFor="Username">Username:</label>
                            <input type="text" id="username" name="username" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secure Storing" required/>
                        </div>
                        <div className="form-actions">
                            <button type="submit" name="type" value="login" className="main-button">LOGIN</button>
                            <a href="/register" className="button-link">REGISTER</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;