import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import "../styles/Home.css";


function Home() {

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // Edit states

    const [editingId, setEditingId] =
        useState(null);

    const [editRating, setEditRating] =
        useState(5);

    const [editOpinion, setEditOpinion] =
        useState("");


    // ================================
    // CURRENT USER
    // ================================

    const storedUser =
        localStorage.getItem("user");

    const currentUser =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    // ================================
    // GET REVIEWS
    // ================================

    const fetchReviews =
        async () => {

            try {
                setLoading(true);

                const response =
                    await axios.get(
                        "http://localhost:5000/api/reviews"
                    );

                setReviews(
                    response.data
                );

                setError("");

            } catch (error) {

                console.error(
                    "Error loading reviews:",
                    error
                );

                setError(
                    "Could not load reviews."
                );

            } finally {

                setLoading(false);

            }
        };


    useEffect(() => {

        fetchReviews();

    }, []);


    // ================================
    // CHECK OWNERSHIP
    // ================================

    const isOwner =
        (review) => {

            if (
                !currentUser ||
                !review.userId
            ) {
                return false;
            }

            const loggedInUserId =
                currentUser.userId ||
                currentUser._id ||
                currentUser.id;

            return (
                String(review.userId) ===
                String(loggedInUserId)
            );
        };


    // ================================
    // START EDIT
    // ================================

    const handleEditStart =
        (review) => {

            setEditingId(
                review._id
            );

            setEditRating(
                review.rating
            );

            setEditOpinion(
                review.opinion
            );
        };


    // ================================
    // CANCEL EDIT
    // ================================

    const handleEditCancel =
        () => {

            setEditingId(null);

            setEditRating(5);

            setEditOpinion("");
        };


    // ================================
    // UPDATE REVIEW
    // ================================

    const handleUpdate =
        async (id) => {

            if (
                !editOpinion.trim()
            ) {
                alert(
                    "Please enter your opinion."
                );

                return;
            }


            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await axios.put(

                        `http://localhost:5000/api/reviews/${id}`,

                        {
                            rating:
                                Number(
                                    editRating
                                ),

                            opinion:
                                editOpinion
                        },

                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                alert(
                    "Review updated successfully!"
                );


                setReviews(
                    (
                        currentReviews
                    ) =>
                        currentReviews.map(
                            (review) =>
                                review._id ===
                                id
                                    ? response
                                          .data
                                          .review
                                    : review
                        )
                );


                handleEditCancel();

            } catch (error) {

                console.error(
                    "Update review error:",
                    error
                );

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Could not update review."
                );
            }
        };


    // ================================
    // DELETE REVIEW
    // ================================

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this review?"
                );

            if (!confirmed) {
                return;
            }


            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                await axios.delete(

                    `http://localhost:5000/api/reviews/${id}`,

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                alert(
                    "Review deleted successfully!"
                );


                setReviews(
                    (
                        currentReviews
                    ) =>
                        currentReviews.filter(
                            (review) =>
                                review._id !==
                                id
                        )
                );

            } catch (error) {

                console.error(
                    "Delete review error:",
                    error
                );

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Could not delete review."
                );
            }
        };


    return (
        <main className="home-page">


            {/* HERO */}

            <section className="hero">

                <p className="section-label">
                    MOVIERATE
                </p>

                <h1>
                    Share Your Movie Opinions
                </h1>

                <p className="hero-text">
                    Discover movies,
                    write reviews,
                    and see what other
                    movie fans think.
                </p>

            </section>


            {/* REVIEWS */}

            <section className="reviews-section">


                <div className="reviews-heading">

                    <p className="section-label">
                        COMMUNITY
                    </p>

                    <h2>
                        Latest Reviews
                    </h2>

                </div>


                {/* LOADING */}

                {loading && (

                    <p className="status-message">
                        Loading reviews...
                    </p>

                )}


                {/* ERROR */}

                {!loading &&
                    error && (

                        <p className="status-message error">
                            {error}
                        </p>

                    )
                }


                {/* NO REVIEWS */}

                {!loading &&
                    !error &&
                    reviews.length ===
                        0 && (

                        <div className="no-reviews">

                            <h3>
                                No reviews yet
                            </h3>

                            <p>
                                Be the first
                                person to write
                                a review!
                            </p>

                        </div>

                    )
                }


                {/* REVIEW GRID */}

                {!loading &&
                    !error &&
                    reviews.length >
                        0 && (

                        <div className="review-grid">


                            {reviews.map(
                                (review) => (

                                    <article
                                        className="review-card"
                                        key={
                                            review._id
                                        }
                                    >


                                        {/* MOVIE POSTER */}

                                        {review.poster && (

                                            <img
                                                src={
                                                    review.poster
                                                }
                                                alt={`${review.movieTitle} poster`}
                                                className="review-poster"
                                            />

                                        )}


                                        {/* EDIT MODE */}

                                        {editingId ===
                                        review._id ? (

                                            <div className="edit-review">

                                                <h3>
                                                    Edit Review
                                                </h3>


                                                <label>
                                                    Rating
                                                </label>


                                                <select
                                                    value={
                                                        editRating
                                                    }
                                                    onChange={(e) =>
                                                        setEditRating(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                >

                                                    <option value="1">
                                                        ⭐ 1
                                                    </option>

                                                    <option value="2">
                                                        ⭐⭐ 2
                                                    </option>

                                                    <option value="3">
                                                        ⭐⭐⭐ 3
                                                    </option>

                                                    <option value="4">
                                                        ⭐⭐⭐⭐ 4
                                                    </option>

                                                    <option value="5">
                                                        ⭐⭐⭐⭐⭐ 5
                                                    </option>

                                                </select>


                                                <label>
                                                    Your Opinion
                                                </label>


                                                <textarea
                                                    value={
                                                        editOpinion
                                                    }
                                                    onChange={(e) =>
                                                        setEditOpinion(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Write your opinion..."
                                                />


                                                <div className="edit-buttons">

                                                    <button
                                                        className="save-button"
                                                        onClick={() =>
                                                            handleUpdate(
                                                                review._id
                                                            )
                                                        }
                                                    >
                                                        Save Changes
                                                    </button>


                                                    <button
                                                        className="cancel-button"
                                                        onClick={
                                                            handleEditCancel
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        ) : (

                                            <>


                                                {/* NORMAL REVIEW */}

                                                <div className="review-card-top">

                                                    <div>

                                                        <h3>
                                                            {
                                                                review.movieTitle
                                                            }
                                                        </h3>


                                                        <p className="review-author">

                                                            Reviewed by{" "}

                                                            <strong>

                                                                {
                                                                    review.username ||
                                                                    "Movie Fan"
                                                                }

                                                            </strong>

                                                        </p>

                                                    </div>


                                                    <div className="rating">

                                                        {"⭐".repeat(
                                                            Number(
                                                                review.rating
                                                            )
                                                        )}

                                                    </div>

                                                </div>


                                                <p className="review-opinion">

                                                    {
                                                        review.opinion
                                                    }

                                                </p>


                                                {review.createdAt && (

                                                    <p className="review-date">

                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString()}

                                                    </p>

                                                )}


                                                {/* OWNER BUTTONS */}

                                                {isOwner(
                                                    review
                                                ) && (

                                                    <div className="review-actions">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                handleEditStart(
                                                                    review
                                                                )
                                                            }
                                                        >
                                                            Edit Review
                                                        </button>


                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    review._id
                                                                )
                                                            }
                                                        >
                                                            Delete Review
                                                        </button>

                                                    </div>

                                                )}

                                            </>

                                        )}

                                    </article>

                                )
                            )}

                        </div>

                    )
                }

            </section>

        </main>
    );
}

export default Home;