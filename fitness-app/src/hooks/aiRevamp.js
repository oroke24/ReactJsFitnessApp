import OpenAI from "openai";
import { getOpenAiApiKey } from "../firebase/firebaseFirestore";


const aiRevamp = async (cardType, content) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
      timeout: 60000,
    });
    console.log(process.env.REACT_APP_OPENAI_API_KEY);
    let aiRole = "";
    if (cardType === "exercise") {
      aiRole =
        "You are a professional fitness trainer, building exercise cards. 'group_one' is for muscle group(s) and 'group_two' is for roughly one or two hours of exercises (Be specific and include sets, reps, or time intervals when helpful). ";
    } else {
      aiRole =
        "You are a professional dietitian/chef, building recipe cards. 'group_one' is for muscle ingredients and 'group_two' is for instructions. ";
    }
    aiRole +=
      "Format response to be a JSON (only raw JSON data, without any markdown like '``` Json... ```'). It should contain a list of strings named 'group_one', and a list of strings named 'group_two'. Begin each string with a hyphen. For 'group_two' use digits for numbers, 18 word limit per string.";
    let userMessage = `Build a card based on this information, feel free to add, modify, or remove as you want: ${content}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      store: true,
      messages: [
        { role: "system", content: aiRole },
        { role: "user", content: userMessage },
      ],
    });
    const messageContent = completion.choices[0].message.content || "";
    const aiCard = parseJson(messageContent);

    return aiCard;
  } catch (error) {
    console.error("Error during aiRevamp: ", error);
  }
};
const parseJson = (jsonObj) => {
    try{
        const aiCard = JSON.parse(jsonObj);
        if(!aiCard.group_one || !aiCard.group_two) {
            console.error("Invalid JSON structure");
        }
        return aiCard;
    }catch(error){console.error('Error parsing jsonObj: ', error)}
};

export default aiRevamp;