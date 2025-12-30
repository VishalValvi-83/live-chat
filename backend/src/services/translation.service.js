import fetch from "node-fetch";
export const translateText = async (text, targetLang, sourceLang = 'en') => {
    try {
        if (!text || !targetLang || !sourceLang) return null;
        
        if (targetLang === sourceLang) return null;

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

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