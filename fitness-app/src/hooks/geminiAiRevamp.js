import { GoogleGenerativeAI } from "@google/generative-ai";

const aiRevampGemini = async (cardType, content) => {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.REACT_APP_GEMINI_API_KEY
    );

    // Build the role instructions
    let aiRole = "";
    if (cardType === "exercise") {
      aiRole =
        "You are a professional fitness trainer, building exercise cards. 'group_one' is for muscle group(s) and 'group_two' is for roughly one or two hours of exercises (Be specific and include sets, reps, or time intervals when helpful). ";
    } else {
      aiRole =
        "You are a professional dietitian/chef, building recipe cards. 'group_one' is for ingredients and 'group_two' is for instructions. ";
    }
    aiRole +=
      "Format response to be a JSON (only raw JSON data, without any markdown like '``` Json... ```'). It should contain a list of strings named 'group_one', and a list of strings named 'group_two'. Begin each string with a hyphen. For 'group_two' use digits for numbers, 18 word limit per string.";

    const userMessage = `Build a card based on this information, feel free to add, modify, or remove as you want: ${content}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // or "gemini-1.5-pro"
    });

    // No system role — Gemini only supports user/model
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${aiRole}\n\n${userMessage}`,
            },
          ],
        },
      ],
    });

    // Extract the response
    const messageContent =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Strip markdown fences if Gemini added any
    const cleaned = messageContent
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    const aiCard = parseJson(cleaned);
    return aiCard;
  } catch (error) {
    console.error("Error during aiRevampGemini:", error);
  }
};

const parseJson = (jsonObj) => {
  try {
    const aiCard = JSON.parse(jsonObj);
    if (!aiCard.group_one || !aiCard.group_two) {
      console.error("Invalid JSON structure");
    }
    return aiCard;
  } catch (error) {
    console.error("Error parsing jsonObj:", error);
  }
};

export default aiRevampGemini;
