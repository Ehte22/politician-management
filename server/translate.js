require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_TRANSLATE_API_KEY = "AIzaSyDZbNiJyPZNhJ3yLhn0MYJrpWwuoMvXslg";

app.post("/translate", async (req, res) => {
    console.log(req.body);

    try {
        const { text, targetLang } = req.body;
        if (!text) return res.json({ translatedText: "" });

        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2`,
            {},
            {
                params: {
                    q: text,
                    target: targetLang,
                    key: GOOGLE_TRANSLATE_API_KEY,
                },
            }
        );

        res.json({ translatedText: response.data.data.translations[0].translatedText });
    } catch (error) {
        res.status(500).json({ error: "Translation failed" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
