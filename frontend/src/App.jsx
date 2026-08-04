import {
    Link,
    Route,
    Routes,
    useNavigate
} from "react-router-dom";

import { useState } from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Review from "./pages/Review";

import "./App.css";


function App() {

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const navigate = useNavigate();


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setLoggedIn(false);

        alert(
            "You have been logged out."
        );

        navigate("/");

    };



    const ProtectedReview = () => {

        if (!loggedIn) {

            return (

                <div className="access-message">

                    <h2>
                        Login Required
                    </h2>

                    <p>
                        You must be logged in
                        to write a movie review.
                    </p>

                    <Link
                        to="/login"
                        className="access-button"
                    >
                        Login
                    </Link>

                </div>

            );

        }


        return <Review />;

    };


    return (

        <>


            <nav className="navbar">


                {/* LOGO */}

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    🎬 MovieRate
                </Link>


                {/* NAV LINKS */}

                <div className="nav-links">


                    <Link to="/">
                        Home
                    </Link>



                    {loggedIn ? (

                        <>

                            <Link to="/review">
                                Write Review
                            </Link>


                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link to="/login">
                                Login
                            </Link>


                            <Link
                                to="/signup"
                                className="nav-signup"
                            >
                                Sign Up
                            </Link>

                        </>

                    )}

                </div>

            </nav>



            <Routes>


                {/* HOME */}

                <Route
                    path="/"
                    element={<Home />}
                />



                {/* SIGNUP */}

                <Route
                    path="/signup"
                    element={<Signup />}
                />



                {/* LOGIN */}

                <Route
                    path="/login"
                    element={
                        <Login
                            onLogin={() =>
                                setLoggedIn(true)
                            }
                        />
                    }
                />



                {/* PROTECTED REVIEW PAGE */}

                <Route
                    path="/review"
                    element={
                        <ProtectedReview />
                    }
                />


            </Routes>

        </>

    );

}


export default App;