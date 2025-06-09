import config from '../../db_config.json' assert { type: 'json' };

const API_KEY = config.API;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page) => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    return data.results;
};

export const searchMovies = async (pagesToFetch = 3) => {
    let allResults = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        const data = await response.json();

        if (data.results) {
            allResults = allResults.concat(data.results);
        }

        // Stop if we reach the last available page
        if (page >= data.total_pages) {
            break;
        }
    }

    return allResults;
};