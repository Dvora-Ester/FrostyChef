import express from "express";
import cors from "cors";
import chef from "./routes/chef.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", chef);
console.log("Starting backend server...");

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Backend running on ${port}`));

export default app;