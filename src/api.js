window.BoltPrep = window.BoltPrep || {};

window.BoltPrep.translateQuizData = async function translateQuizData(quizItem, apiKey) {
    if (!apiKey) throw new Error("請先設定 API Key");
    const isGroq = apiKey.startsWith("gsk_");
    const prompt = `Translate to Traditional Chinese (zh-TW). Return JSON only. \n ${JSON.stringify({ question: quizItem.question, options: quizItem.options, discussions: quizItem.discussions.slice(0, 2) })}`;
    const url = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body = isGroq
        ? { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }
        : { contents: [{ parts: [{ text: prompt }] }] };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": isGroq ? `Bearer ${apiKey}` : "",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const result = await response.json();
    const text = isGroq ? result.choices[0].message.content : result.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json\n?|```/g, "").trim());
};
