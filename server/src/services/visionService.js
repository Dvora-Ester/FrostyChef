import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export default class VisionService {
    constructor(apiKey = null) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) throw new Error("GEMINI_API_KEY missing");

        this.genAI = new GoogleGenerativeAI(key);
        // שימוש בגרסה היציבה
        this.modelId = "gemini-2.5-flash";
    }

    async analyzeIngredients(imageBuffer, mimeType = 'image/jpeg') {
        console.log('#analyzeIngredients');
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.modelId,
                generationConfig: {
                    temperature: 0.4,
                    topP: 0.9,
                    maxOutputTokens: 1024
                }
            });

            const prompt = `
You are an API that returns ONLY valid JSON.
You MUST return raw JSON and nothing else.
Do NOT include explanations, comments, markdown, or newlines outside JSON.
All strings MUST be properly escaped.

Return exactly this structure:

{
  "detected_ingredients": ["string"],
  "suggested_recipe": {
    "name": "string",
    "difficulty": "easy|medium|hard",
    "prep_time": "string",
    "instructions": ["string"],
    "nutrition_summary": "string"
  },
  "missing_essential_items": ["string"]
}
`;


            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType
                }
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            let text = response.text();

            // מנגנון ניקוי לטקסט למקרה שה-AI מחזיר Markdown
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }
            console.log("VisionService Result Text:");
            return JSON.parse(text);
        } catch (error) {
            console.error("VisionService Error:", error);
            throw error;
        }
    }
}