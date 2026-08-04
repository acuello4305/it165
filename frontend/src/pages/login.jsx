import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );


            // Save JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );


            // Tell App.jsx that login
            // was successful
            onLogin();


            alert(
                "Login successful!"
            );


            // Go back to Home
            navigate("/");


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );

        }

    };


    return (

        <main className="login-page">


            <div className="login-container">


                <p className="section-label">
                    MOVIERATE
                </p>


                <h1>
                    Login
                </h1>


                <p>
                    Login to write movie reviews.
                </p>



                <form onSubmit={handleSubmit}>


                    <label htmlFor="email">
                        Email
                    </label>


                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="Enter your email"
                        required
                    />



                    <label htmlFor="password">
                        Password
                    </label>


                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter your password"
                        required
                    />



                    <button type="submit">
                        Login
                    </button>


                </form>



                <p className="login-signup">

                    Don't have an account?{" "}

                    <Link to="/signup">
                        Sign up
                    </Link>

                </p>


            </div>

        </main>

    );

}


export default Login;