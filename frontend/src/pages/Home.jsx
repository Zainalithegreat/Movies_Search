import React, { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from "../services/api";
import "../static/HomePage.css"

function Home(){
    const [movie, setMovie] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [totalMovies, setTotalMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [allMoveies, setAllMoveies] = useState([]);
    const API = import.meta.env.VITE_API_BASE_URL;

    // Fetch movies when component loads
    useEffect(() => {
        const fetchMovies = async () => {
            const movies = await getPopularMovies(page); // ✅ await async function
            setTotalMovies(movies);                 // ✅ store in state
        };

        fetchMovies();
    }, [page]);

    useEffect(() => {
        const searchForMovies = async () => {
            const movies = await searchMovies(100); // ✅ await async function
            setAllMoveies(movies);                 // ✅ store in
            // state
        };

        searchForMovies();
    }, []);


    const Searching = (e) => {
        e.preventDefault();
        console.log("filteredMovies: ", filteredMovies)
        const searchTerm = movie.toLowerCase();
        if (movie !== "") {
            const results = allMoveies.filter(totMovie =>
                totMovie.title.toLowerCase().startsWith(searchTerm)
            ).slice(0, 15);
            setFilteredMovies(results)
        }else{
            setFilteredMovies([])
        }

    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    const loadLess = () => {
        if (page > 1){
            setPage(prev => prev - 1)
        }
    }
    function Clear(){
        setMovie('')
        setFilteredMovies([])
    }

    return (
        <>
            <form onSubmit={Searching}>
                <h1>Movie</h1>
                <input type="text" className="movie-input" placeholder="search" value={movie}
                       onChange={(e) => setMovie(e.target.value)}/>
                <div className="search-clear">
                    <button type="submit">Search</button>
                    <button type="button" onClick={Clear}>Clear</button>
                </div>
            </form>

            <div className="movie-grid">

            </div>
            <Wrapper totalMovies={(filteredMovies.length > 0 && filteredMovies.length <= 15)   ? filteredMovies : totalMovies} />
            <div>
                {(filteredMovies.length === 0 || filteredMovies.length === 20) && (
                    <div className="main-page-container">
                        <div className="page-container">
                            <button onClick={loadLess}>Load Less</button>
                            <h3 className="page-number">{page}</h3>
                            <button onClick={loadMore}>Load More</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

function Wrapper({totalMovies}) {
    const username = localStorage.getItem("username");
    const API = import.meta.env.VITE_API_BASE_URL;

    async function addFavorite(movie) {
        const movieID = movie.id;
        const movieTitle = movie.title;
        const movieRelease = movie.release_date
        const moviePath = movie.poster_path
        console.log(movie);
        const response = await fetch(`${API}/home`, {
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