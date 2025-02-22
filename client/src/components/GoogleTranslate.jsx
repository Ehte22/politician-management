// import React, { useState } from "react";
// import axios from "axios";

// const GoogleTranslate = () => {
//     const [lang, setLang] = useState("en");
//     const [translations, setTranslations] = useState({
//         welcome_message: "Welcome",
//         logout: "Logout",
//         title: "The Benefits of Learning a New Language",
//         desc: "Learning a new language is an exciting and rewarding experience that offers numerous benefits, both personal and professional. In today’s globalized world, the ability to communicate in more than one language opens up many opportunities. Whether for travel, career advancement, or personal growth, learning a new language can enhance various aspects of life."
//     });

//     const textsToTranslate = {
//         welcome_message: "Welcome",
//         logout: "Logout",
//         title: "The Benefits of Learning a New Language",
//         desc: "Learning a new language is an exciting and rewarding experience that offers numerous benefits, both personal and professional. In today’s globalized world, the ability to communicate in more than one language opens up many opportunities. Whether for travel, career advancement, or personal growth, learning a new language can enhance various aspects of life."
//     };

//     const changeLanguage = async (lng) => {
//         setLang(lng);

//         if (lng === "en") {
//             // Skip API call if selected language is English
//             setTranslations(textsToTranslate);
//             return;
//         }

//         const newTranslations = {};
//         const sourceLang = "en";

//         for (const key in textsToTranslate) {
//             try {
//                 const response = await axios.get(
//                     // `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textsToTranslate[key])}&langpair=en|${lng}`
//                     `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textsToTranslate[key])}&langpair=${sourceLang}|${lng}`

//                 );
//                 newTranslations[key] = response.data.responseData.translatedText;
//             } catch (error) {
//                 console.error("Translation error:", error);
//                 newTranslations[key] = textsToTranslate[key]; // Fallback to default text
//             }
//         }

//         setTranslations(newTranslations);
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h2>Multilingual Support (MyMemory API)</h2>

//             <select onChange={(e) => changeLanguage(e.target.value)} value={lang}>
//                 <option value="en">English</option>
//                 <option value="fr">French</option>
//                 <option value="es">Spanish</option>
//                 <option value="mr">marathi</option>
//             </select>

//             <h1>{translations.welcome_message}</h1>
//             <div className="text-lg font-semibold">{translations.title}</div>
//             <p>{translations.desc}</p>
//         </div>
//     );
// };

// export default GoogleTranslate;

import React, { useState, useEffect } from "react";

const GoogleTranslate = () => {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [lang, setlang] = useState("mr")
    console.log(lang);


    const handleTranslate = async (text) => {
        const encodedText = encodeURIComponent(text);

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodedText}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            // The translated text will be in the first element of the response
            return data[0].map((item) => item[0]).join(" ");
        } catch (error) {
            console.error("Translation error:", error);
            return text;  // return original text in case of error
        }
    };

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(async () => {
    //         if (inputText) {
    //             const translated = await handleTranslate(inputText);
    //             setTranslatedText(translated);
    //         } else {
    //             setTranslatedText("");
    //         }
    //     }, 1000); // debounce to prevent API spamming

    //     return () => clearTimeout(delayDebounceFn);
    // }, [inputText]);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleBlur = async () => {
        if (inputText) {
            const translated = await handleTranslate(inputText);
            setInputText(translated);
        } else {
            setInputText("");
        }
    };

    return (
        <div>
            <h2>Real-Time Google Translate (English → Marathi)</h2>
            <input
                type="text"
                className="block w-96 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Type in English..."
                value={inputText}
                // onChange={(e) => setInputText(e.target.value)}
                onChange={handleInputChange}
                onBlur={handleBlur}
            />
        </div>
    );
};

export default GoogleTranslate;


// import React, { useState, useEffect } from "react";

// const GoogleTranslate = () => {
//     const [inputText, setInputText] = useState("");
//     const [translatedText, setTranslatedText] = useState("");

//     useEffect(() => {
//         const translateText = async () => {
//             if (!inputText) {
//                 setTranslatedText("");
//                 return;
//             }

//             const encodedText = encodeURIComponent(inputText);
//             const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodedText}`;

//             try {
//                 const response = await fetch(url);
//                 const data = await response.json();
//                 setTranslatedText(data[0].map((item) => item[0]).join(" "));
//             } catch (error) {
//                 console.error("Translation error:", error);
//             }
//         };

//         const delayDebounceFn = setTimeout(() => {
//             translateText();
//         }, 500); // Debounce API calls

//         return () => clearTimeout(delayDebounceFn);
//     }, [inputText]);

//     return (
//         <div>
//             <h2>Real-Time Google Translate (English → Marathi)</h2>
//             <input
//                 type="text"
//                 placeholder="Type in English..."
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//             />
//             <p><strong>Marathi:</strong> {translatedText}</p>
//         </div>
//     );
// };

// export default GoogleTranslate;

// With Backend
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const GoogleTranslate = () => {
//     const [inputText, setInputText] = useState("");
//     const [translatedText, setTranslatedText] = useState("");

//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             if (inputText) {
//                 translateText(inputText);
//             } else {
//                 setTranslatedText(""); // Clear translation if input is empty
//             }
//         }, 500); // Debounce API calls to avoid too many requests

//         return () => clearTimeout(delayDebounceFn);
//     }, [inputText]);

//     const translateText = async (text) => {
//         try {
//             const response = await axios.post("http://localhost:5000/translate", {
//                 text,
//                 targetLang: "mr", // Marathi
//             });
//             setTranslatedText(response.data.translatedText);
//         } catch (error) {
//             console.error("Translation Error:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Real-Time Google Translate (English → Marathi)</h2>
//             <input
//                 type="text"
//                 placeholder="Type in English..."
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//             />
//             <p><strong>Marathi:</strong> {translatedText}</p>
//         </div>
//     );
// };

// export default GoogleTranslate;

