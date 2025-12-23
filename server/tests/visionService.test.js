import { jest } from '@jest/globals';

// 1. הגדרת ה-Mock חייבת לקרות לפני ייבוא ה-VisionService
jest.unstable_mockModule('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: class {
            constructor(apiKey) {
                this.apiKey = apiKey;
            }
            getGenerativeModel() {
                return {
                    generateContent: jest.fn().mockResolvedValue({
                        response: {
                            text: () => JSON.stringify({
                                detected_ingredients: ["Tomato", "Egg"],
                                suggested_recipe: { name: "Omelette", instructions: ["Fry"] },
                                missing_essential_items: []
                            })
                        }
                    })
                };
            }
        }
    };
});

// 2. ייבוא השירות וה-Class של גוגל אחרי ה-Mock
const VisionService = (await import('../src/services/visionService.js')).default;
const { GoogleGenerativeAI } = await import('@google/generative-ai');

describe('VisionService Unit Tests', () => {
    let visionService;

    beforeEach(() => {
        process.env.GEMINI_API_KEY = 'test-key';
        visionService = new VisionService();
    });

    test('should throw error if API key is missing', () => {
        delete process.env.GEMINI_API_KEY;
        // אנחנו בודקים את הזריקה של השגיאה בקונסטרטור
        expect(() => new VisionService()).toThrow("GEMINI_API_KEY missing");
    });

    test('should analyze ingredients and return parsed JSON', async () => {
        const result = await visionService.analyzeIngredients(Buffer.from('fake-image'), 'image/jpeg');

        expect(result.suggested_recipe.name).toBe("Omelette");
        expect(result.detected_ingredients).toContain("Tomato");
    });
});