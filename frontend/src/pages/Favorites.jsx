import App from "../App.jsx";
import React from "react";
import { useEffect, useState } from "react";
import "../static/HomePage.css"
import {useNavigate} from "react-router-dom";

function Favorites() {
    const username = localStorage.getItem("username");
    const [favorites, setFavorites] = useState([]); // ✅ state to trigger re-render
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        async function fetchFavorites() {
            const response = await fetch('http://localhost:3001/favorites', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: username })
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favs); // ✅ FIXED: only set the array
                console.log(data.favs);
            } else {
                const err = await response.json();
                alert("❌ " + err.message);
            }
        }

        if (username) {
            fetchFavorites();
        }
    }, [username]);
// ✅ dependency array

    async function removeFavorite(movie) {
        const username = localStorage.getItem("username");
        const title = movie.title;
        const response = await fetch(`${API}/remove`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movies: title, username })
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            window.location.reload()
        } else {
            const err = await response.json();
            alert("❌ " + err.message);
        }
    }

    return (
        <div className="movie-page">
            <h1 className="page-title">Favorites</h1>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <p>You don't have any favorites yet! ❤️</p>
                    <button onClick={() => navigate("/home")}>Browse Movies</button>
                </div>
            ) : (
                <div className="movie-row">
                    {favorites.map(movie => (
                        <div className="movie-container" key={movie.MovieID}>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.PosterPath}`} alt={movie.title} />
                            <div className="movie-info">
                                <div>{movie.title}</div>
                                <div>{movie.date}</div>
                                <button onClick={() => removeFavorite(movie)}>❌</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}


export default Favorites