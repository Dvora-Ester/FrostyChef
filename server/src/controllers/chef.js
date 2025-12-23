

import VisionService from "../services/visionService.js";

const visionProcessor = new VisionService();
export default async function generateRecipe(req, res) {
  console.log('#1 generateRecipe called');
  try {
    const { image, type, notes } = req.body;

    if (!image) {
      return res.status(400).json({ ok: false, error: "לא התקבלה תמונה" });
    }

    // חילוץ ה-Base64 הנקי (ללא ה-prefix של data:image/jpeg;base64)
    const base64Data = image.split(",")[1] || image;
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('*8 Analyzing image for ingredients...');
    // שליחת ההערות והסגנון (פרווה/בשרי) כחלק מהפרומפט
    const result = await visionProcessor.analyzeIngredients(imageBuffer, 'image/jpeg');

    return res.json({
      ok: true,
      data: result
    });

  } catch (err) {
    console.log('Error in generateRecipe:', err.message);
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal Server Error"
    });
  }
}