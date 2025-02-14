import React, { useState } from "react";
import axios from "axios";

const GoogleTranslate = () => {
    const [text, setText] = useState("Welcome to our website");
    const [translatedText, setTranslatedText] = useState("");
    const [language, setLanguage] = useState("fr");

    console.log(text);


    const translateText = async () => {
        const API_KEY = "AIzaSyDZbNiJyPZNhJ3yLhn0MYJrpWwuoMvXslg";
        const url = `https://translation.googleapis.com/language/translate/v2`;

        try {
            const response = await axios.get(url, {
                params: {
                    q: text,
                    source: "en",
                    target: language,
                    key: API_KEY
                }
            });

            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error("Translation error:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>{translatedText || text}</h1>
            <select onChange={(e) => setLanguage(e.target.value)}>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
            </select>
            <button onClick={translateText}>Translate</button>
        </div>
    );
};

export default GoogleTranslate;
