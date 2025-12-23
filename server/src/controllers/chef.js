// שימוש ב-require כי ה-Service משתמש ב-module.exports
import VisionService from "../services/visionService.js";

export async function generateRecipe(req, res) {
  console.log('#1 generateRecipe called');
  try {
    // הנחה: התמונה מגיעה ב-body כ-base64 או דרך multer ב-req.file
    // אם את משתמשת ב-Multer, זה יהיה req.file.buffer
    const imageBuffer = req.file ? req.file.buffer : Buffer.from(req.body.image, 'base64');
    const mimeType = req.file ? req.file.mimetype : 'image/jpeg';

    console.log('*8 Analyzing image for ingredients...');
    const result = await visionProcessor.analyzeIngredients(imageBuffer, mimeType);

    return res.json({
      ok: true,
      version: "v1",
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