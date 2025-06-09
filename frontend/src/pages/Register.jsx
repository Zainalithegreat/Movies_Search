import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import "../static/loginRegister.css"

function Register(){
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;

    function emailValidation(email) {
        // Regex from the original Python version
        const pattern = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
    }

    function passValidation(password) {
        const length_check = password.length >= 5;
        const number_check = /\d/.test(password);
        const special_check = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return length_check && number_check && special_check;
    }


    async function Registering(e){
        e.preventDefault();
        console.log("name: ", name);
        console.log("username: ", username);
        console.log("email: ", email);
        console.log("password: ", password);
        console.log("confirmPassword: ", confirmPassword);

        if (!name) {
            setError("Please enter your name.")
            return
        }
        if (!username) {
            setError("Please enter your username.");
            return
        }
        if (!email) {
            setError("Please enter your email.");
            return
        }
        if (!password) {
            setError("Please enter your password.");
            return
        }
        if (!confirmPassword) {
            setError("Please confirm your password.");
            return
        }

        if (!emailValidation(email)) {
            setError("Please enter a valid email address.");
            return
        }
        if (!passValidation(password)) {
            setError("Password must be minimum 5 Characters, 1 Number, 1 Special character")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        setError("")

        try {
            const response = await fetch(`${API}/register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: name, email, username, password })
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
            <div className="form-container">
                {error && <label className="error-label">{error}</label>}
                <form method="Post" onSubmit={Registering} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name:</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name"
                               required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}
                               placeholder="Username" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                               required/>

                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirm">Confirm Password:</label>
                        <input type="password" id="password_confirm" name="password_confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                               placeholder="Confirm Password" required/>
                    </div>

                    <div className="form-actions">
                        <button type="submit" name="type" value="register" className="main-button">REGISTER</button>
                        <a href="/login" className="button-link ">Back to Login</a>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register;