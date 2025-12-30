import fetch from "node-fetch"; 

export const translateText = async (text, targetLang) => {
    try {
        if (!text || !targetLang || targetLang === "en") return null;

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        }
        return null;
    } catch (error) {
        console.error("Translation Error:", error);
        return null;
    }
};