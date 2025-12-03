import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    apiKey = match[1].trim();
  }
} catch (e) {
  console.error("Could not read .env.local");
}

if (!apiKey) {
  console.error("API Key not found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    console.log("Fetching available models...");
    const response = await ai.models.list();
    fs.writeFileSync('models.txt', JSON.stringify(response, null, 2));
    console.log("Models written to models.txt");
  } catch (error) {
    console.error("Error listing models:", error);
    fs.writeFileSync('models.txt', `Error: ${error}`);
  }
}

listModels();
