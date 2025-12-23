import { Router } from "express";
import generateRecipe from "../controllers/chef.js";

const router = Router();

router.post("/chef", generateRecipe);
export default router;