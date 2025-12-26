import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    // List models is not directly available in some versions of SDK or might require different approach
    // We try to list them via fetch to be sure
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await resp.json();
    console.log("Available Gemini Models:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to list models:", e);
  }
}

listModels();
