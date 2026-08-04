const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({
                message: "Please provide a movie title."
            });
        }

        const response = await axios.get(
            "https://www.omdbapi.com/",
            {
                params: {
                    apikey: process.env.OMDB_API_KEY,
                    t: title
                }
            }
        );

        if (response.data.Response === "False") {
            return res.status(404).json({
                message: "Movie not found."
            });
        }

        res.status(200).json(response.data);

    } catch (error) {
        console.error("Movie API error:", error.message);

        res.status(500).json({
            message: "Could not search for movie."
        });
    }
});

module.exports = router;