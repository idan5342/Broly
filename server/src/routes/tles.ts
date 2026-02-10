import express from "express";
import { getTLEs } from "../controllers/tles.js";

const router = express.Router();

router.get("/", getTLEs);

export default router;