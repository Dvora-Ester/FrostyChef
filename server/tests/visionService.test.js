import VisionService from './src/services/visionService.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// יצירת "מוק" לספרייה של גוגל
jest.mock("@google/generative-ai");

describe('VisionService Tests', () => {
    let visionService;

    beforeEach(() => {
        // איפוס לפני כל בדיקה
        process.env.GEMINI_API_KEY = 'test-key';
        visionService = new VisionService();
    });

    test('should throw error if API key is missing', () => {
        delete process.env.GEMINI_API_KEY;
        expect(() => new VisionService()).toThrow("GEMINI_API_KEY missing");
    });

    test('should analyze ingredients and return parsed JSON', async () => {
        // דימוי התשובה שחוזרת מה-AI
        const mockResponse = {
            response: {
                text: () => JSON.stringify({
                    detected_ingredients: ["Tomato", "Egg"],
                    suggested_recipe: { name: "Omelette", instructions: ["Fry"] },
                    missing_essential_items: []
                })
            }
        };

        // הגדרת המוק שיחזיר את התשובה שלנו
        const mockGenerateContent = jest.fn().mockResolvedValue(mockResponse);
        GoogleGenerativeAI.prototype.getGenerativeModel = jest.fn().mockReturnValue({
            generateContent: mockGenerateContent
        });

        const result = await visionService.analyzeIngredients(Buffer.from('fake-image'), 'image/jpeg');

        expect(result.suggested_recipe.name).toBe("Omelette");
        expect(mockGenerateContent).toHaveBeenCalled();
    });
});