const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const generateSummary = async (text) => {
  const response = await openai.createCompletion({
    model: "gpt-4-turbo",
    prompt: `Summarize this news in 100 words: ${text}`,
    max_tokens: 150,
  });
  return response.data.choices[0].text.trim();
};

module.exports = { generateSummary };
