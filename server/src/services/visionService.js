import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

class VisionService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY missing");
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // הגדרה שמכריחה את המודל להחזיר JSON
        this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
    }

    async analyzeIngredients(imageBuffer, mimeType) {
        try {
            console.log("Analyzing image for ingredients...");

            const prompt = `Analyze this fridge image. 
            Return a JSON object with this exact structure:
            {
              "detected_ingredients": ["list", "of", "items"],
              "suggested_recipe": { 
                "name": "recipe name", 
                "instructions": "clear steps" 
              },
              "missing_essential_items": ["item1"]
            }
            Important: Ensure the JSON is complete and not truncated.`;

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType
                },
            };

            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            let text = response.text();

            // ניקוי תגיות Markdown במקרה שהמודל הוסיף אותן למרות ההגדרות
            text = text.replace(/```json|```/g, "").trim();

            console.log("VisionService Raw Text:", text);

            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error("JSON Parse Error. Raw text was:", text);
                // במקרה של שגיאת Parse, ננסה להחזיר אובייקט בסיסי כדי שהאפליקציה לא תקרוס
                throw new Error("Failed to parse AI response");
            }
        } catch (error) {
            console.error("VisionService Error:", error.message);
            throw error;
        }
    }
}

export default VisionService;