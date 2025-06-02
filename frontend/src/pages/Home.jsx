import React, { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from "../services/api";
import "../static/HomePage.css"

function Home(){
    const [movie, setMovie] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [totalMovies, setTotalMovies] = useState([]);

    // Fetch movies when component loads
    useEffect(() => {
        const fetchMovies = async () => {
            const movies = await getPopularMovies(); // ✅ await async function
            setTotalMovies(movies);                 // ✅ store in state
        };

        fetchMovies();
    }, []);

    const Searching = (e) => {
        e.preventDefault();
        const searchTerm = movie.toLowerCase();

        const results = totalMovies.filter(totMovie =>
            totMovie.title.toLowerCase().startsWith(searchTerm)
        );
        setFilteredMovies(results)

    };


    return (
        <>
            <form onSubmit={Searching}>
                <h1>Movie</h1>
                <input type="text" className="movie-input"value={movie} onChange={(e) => setMovie(e.target.value)}/>
                <button type="submit">Search</button>
            </form>

            <div className="movie-grid">

            </div>
                <Wrapper totalMovies={filteredMovies.length > 0 ? filteredMovies : totalMovies} />
            <div>

            </div>
        </>
    );
}

function Wrapper({totalMovies}){
    const username = localStorage.getItem("username");

    async function addFavorite(movie){
        const movieID = movie.id;
        const movieTitle = movie.title;
        const movieRelease = movie.release_date
        const moviePath = movie.poster_path
        console.log(movie);
        const response = await fetch('http://localhost:3001/home', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({movies: movieID, movieTitle, movieRelease, moviePath, username })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const err = await response.json();
            alert("❌ " + err.message);
        }
    }

    return (
        <div className="movie-row">
            {totalMovies.map(movie => (
                <div className="movie-container" key={movie.id}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <div className="movie-info">
                        <div>{movie.title}</div>
                        <div>{movie.release_date}</div>
                        <button onClick={() => addFavorite(movie)}>♥</button>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default Home;