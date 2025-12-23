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
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are an expert chef and nutritionist. Analyze the image of the fridge or ingredients.
            Return ONLY a valid JSON object. Do not include markdown formatting or backticks.
            
            Structure:
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