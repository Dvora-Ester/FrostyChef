import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export default class VisionService {
    constructor(apiKey = null) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) throw new Error("GEMINI_API_KEY missing");

        this.genAI = new GoogleGenerativeAI(key);
        this.modelId = "gemini-1.5-flash";
    }

    async analyzeIngredients(imageBuffer, mimeType = 'image/jpeg') {
        try {
            const model = this.genAI.getGenerativeModel({ 
                model: this.modelId,
                generationConfig: { responseMimeType: "application/json" }
            });

            // פרומפט ממוקד ל-Chef-Mirror
            const prompt = `
            You are an expert chef and nutritionist. Analyze the image of the fridge or ingredients.
            Return a JSON object with:
            {
              "detected_ingredients": ["list of items found"],
              "suggested_recipe": {
                "name": "string",
                "difficulty": "easy/medium/hard",
                "prep_time": "string",
                "instructions": ["step 1", "step 2"],
                "nutrition_summary": "calories, protein, etc."
              },
              "missing_essential_items": ["items needed but not in the image"]
            }`;

            const imagePart = {
                inlineData: { data: imageBuffer.toString("base64"), mimeType }
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("VisionService Error:", error);
            throw error;
        }
    }
}

