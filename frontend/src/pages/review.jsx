import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/Review.css";

function Review() {
    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;


    // ================================
    // REVIEW STATES
    // ================================

    const [movieTitle, setMovieTitle] =
        useState("");

    const [rating, setRating] =
        useState("5");

    const [opinion, setOpinion] =
        useState("");


    // ================================
    // MOVIE SEARCH STATES
    // ================================

    const [searchTitle, setSearchTitle] =
        useState("");

    const [movie, setMovie] =
        useState(null);

    const [searchError, setSearchError] =
        useState("");

    const [searching, setSearching] =
        useState(false);


    // ================================
    // PROTECT PAGE
    // ================================

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ================================
    // SEARCH MOVIE
    // ================================

    const handleMovieSearch =
        async (event) => {

            event.preventDefault();

            if (!searchTitle.trim()) {
                setSearchError(
                    "Please enter a movie title."
                );

                return;
            }

            try {
                setSearching(true);

                setSearchError("");

                setMovie(null);

                const response =
                    await axios.get(
                        "http://localhost:5000/api/movies/search",
                        {
                            params: {
                                title: searchTitle
                            }
                        }
                    );

                setMovie(
                    response.data
                );

                setMovieTitle(
                    response.data.Title
                );

            } catch (error) {
                console.error(
                    "Movie search error:",
                    error
                );

                setSearchError(
                    error.response?.data?.message ||
                    "Movie could not be found."
                );

            } finally {
                setSearching(false);
            }
        };


    // ================================
    // SUBMIT REVIEW
    // ================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            try {
                const posterUrl =
                    movie?.Poster &&
                    movie.Poster !== "N/A"
                        ? movie.Poster
                        : "";

                await axios.post(
                    "http://localhost:5000/api/reviews",
                    {
                        movieTitle,

                        poster: posterUrl,

                        rating:
                            Number(rating),

                        opinion
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Review submitted successfully!"
                );

                setMovieTitle("");
                setRating("5");
                setOpinion("");

                setSearchTitle("");
                setMovie(null);
                setSearchError("");

            } catch (error) {
                console.error(
                    "Review submission error:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Could not submit review."
                );
            }
        };


    return (
        <main className="review-page">


            {/* HEADER */}

            <div className="review-header">

                <p className="section-label">
                    MOVIE REVIEW
                </p>

                <h1>
                    Write a Review
                </h1>

                <p>
                    Welcome, {user?.username}!
                    Search for a movie and
                    share your opinion.
                </p>

            </div>


            {/* MOVIE SEARCH */}

            <section className="movie-search">

                <h2>
                    Find Your Movie
                </h2>

                <form
                    className="search-form"
                    onSubmit={
                        handleMovieSearch
                    }
                >

                    <input
                        type="text"
                        value={searchTitle}
                        onChange={(event) =>
                            setSearchTitle(
                                event.target.value
                            )
                        }
                        placeholder="Search for a movie..."
                    />

                    <button
                        type="submit"
                        className="search-button"
                    >
                        {searching
                            ? "Searching..."
                            : "Search"}
                    </button>

                </form>


                {searchError && (
                    <p className="search-error">
                        {searchError}
                    </p>
                )}

            </section>


            {/* MOVIE RESULT */}

            {movie && (

                <section className="movie-result">


                    {movie.Poster &&
                        movie.Poster !== "N/A" && (

                            <img
                                src={
                                    movie.Poster
                                }
                                alt={`${movie.Title} poster`}
                                className="movie-poster"
                            />

                        )}


                    <div className="movie-info">

                        <h2>
                            {movie.Title}
                        </h2>


                        <p>
                            <strong>
                                Year:
                            </strong>{" "}
                            {movie.Year}
                        </p>


                        <p>
                            <strong>
                                Genre:
                            </strong>{" "}
                            {movie.Genre}
                        </p>


                        <p>
                            <strong>
                                IMDb Rating:
                            </strong>{" "}
                            ⭐{" "}
                            {movie.imdbRating}
                        </p>


                        <p className="movie-plot">
                            {movie.Plot}
                        </p>

                    </div>

                </section>

            )}


            {/* REVIEW FORM */}

            <form
                className="review-form"
                onSubmit={handleSubmit}
            >

                <label htmlFor="movieTitle">
                    Movie Title
                </label>

                <input
                    id="movieTitle"
                    type="text"
                    value={movieTitle}
                    onChange={(event) =>
                        setMovieTitle(
                            event.target.value
                        )
                    }
                    placeholder="Search for a movie above"
                    required
                />


                <label htmlFor="rating">
                    Your Rating
                </label>


                <select
                    id="rating"
                    value={rating}
                    onChange={(event) =>
                        setRating(
                            event.target.value
                        )
                    }
                    required
                >

                    <option value="1">
                        ⭐ 1 / 5 — Terrible
                    </option>

                    <option value="2">
                        ⭐⭐ 2 / 5 — Not Great
                    </option>

                    <option value="3">
                        ⭐⭐⭐ 3 / 5 — Okay
                    </option>

                    <option value="4">
                        ⭐⭐⭐⭐ 4 / 5 — Great
                    </option>

                    <option value="5">
                        ⭐⭐⭐⭐⭐ 5 / 5 — Amazing
                    </option>

                </select>


                <label htmlFor="opinion">
                    Your Opinion
                </label>


                <textarea
                    id="opinion"
                    value={opinion}
                    onChange={(event) =>
                        setOpinion(
                            event.target.value
                        )
                    }
                    placeholder="What did you think about the movie?"
                    rows="7"
                    required
                />


                <button
                    type="submit"
                    className="review-submit"
                >
                    ⭐ Submit Review
                </button>

            </form>

        </main>
    );
}

export default Review;